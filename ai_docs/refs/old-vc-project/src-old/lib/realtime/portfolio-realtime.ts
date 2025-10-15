import { createClient, RealtimeChannel } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface RealtimePortfolioUpdate {
  type:
    | "document_processed"
    | "document_error"
    | "portfolio_updated"
    | "analytics_updated";
  documentId?: string;
  userId: string;
  data: any;
  timestamp: Date;
}

export interface RealtimeSubscription {
  channel: RealtimeChannel;
  unsubscribe: () => void;
}

export class PortfolioRealtimeService {
  private static subscriptions = new Map<string, RealtimeSubscription>();

  /**
   * Subscribe to document processing updates for a user
   */
  static subscribeToDocumentUpdates(
    userId: string,
    onUpdate: (update: RealtimePortfolioUpdate) => void
  ): RealtimeSubscription {
    const channelName = `portfolio_updates_${userId}`;

    // Unsubscribe from existing subscription if any
    if (this.subscriptions.has(channelName)) {
      this.subscriptions.get(channelName)?.unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Document update received:", payload);

          let updateType: RealtimePortfolioUpdate["type"] = "portfolio_updated";

          // Determine update type based on status change
          if (payload.eventType === "UPDATE") {
            const newStatus = payload.new?.status;
            const oldStatus = payload.old?.status;

            if (oldStatus === "processing" && newStatus === "completed") {
              updateType = "document_processed";
            } else if (oldStatus === "processing" && newStatus === "error") {
              updateType = "document_error";
            }
          } else if (payload.eventType === "INSERT") {
            updateType = "portfolio_updated";
          }

          const update: RealtimePortfolioUpdate = {
            type: updateType,
            documentId: payload.new?.id || payload.old?.id,
            userId,
            data: {
              document: payload.new || payload.old,
              eventType: payload.eventType,
              extractedData: payload.new?.extracted_data,
              processingMethod: payload.new?.processing_method,
            },
            timestamp: new Date(),
          };

          onUpdate(update);
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for ${channelName}:`, status);
      });

    const subscription: RealtimeSubscription = {
      channel,
      unsubscribe: () => {
        console.log(`Unsubscribing from ${channelName}`);
        supabase.removeChannel(channel);
        this.subscriptions.delete(channelName);
      },
    };

    this.subscriptions.set(channelName, subscription);
    return subscription;
  }

  /**
   * Subscribe to analytics updates (aggregated data changes)
   */
  static subscribeToAnalyticsUpdates(
    userId: string,
    onUpdate: (update: RealtimePortfolioUpdate) => void
  ): RealtimeSubscription {
    const channelName = `analytics_updates_${userId}`;

    // Unsubscribe from existing subscription if any
    if (this.subscriptions.has(channelName)) {
      this.subscriptions.get(channelName)?.unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "documents",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          // Only trigger analytics updates for completed documents
          if (
            payload.new?.status === "completed" &&
            payload.new?.extracted_data
          ) {
            console.log(
              "Analytics update triggered for document:",
              payload.new.id
            );

            const update: RealtimePortfolioUpdate = {
              type: "analytics_updated",
              documentId: payload.new.id,
              userId,
              data: {
                documentId: payload.new.id,
                extractedData: payload.new.extracted_data,
                processingMethod: payload.new.processing_method,
                // Trigger analytics recalculation
                triggerAnalytics: true,
              },
              timestamp: new Date(),
            };

            onUpdate(update);
          }
        }
      )
      .subscribe((status) => {
        console.log(
          `Analytics subscription status for ${channelName}:`,
          status
        );
      });

    const subscription: RealtimeSubscription = {
      channel,
      unsubscribe: () => {
        console.log(`Unsubscribing from ${channelName}`);
        supabase.removeChannel(channel);
        this.subscriptions.delete(channelName);
      },
    };

    this.subscriptions.set(channelName, subscription);
    return subscription;
  }

  /**
   * Subscribe to all portfolio updates for a user
   */
  static subscribeToAllUpdates(
    userId: string,
    onUpdate: (update: RealtimePortfolioUpdate) => void
  ): RealtimeSubscription[] {
    const subscriptions = [
      this.subscribeToDocumentUpdates(userId, onUpdate),
      this.subscribeToAnalyticsUpdates(userId, onUpdate),
    ];

    return subscriptions;
  }

  /**
   * Unsubscribe from all updates for a user
   */
  static unsubscribeFromAll(userId: string): void {
    const channelNames = [
      `portfolio_updates_${userId}`,
      `analytics_updates_${userId}`,
    ];

    channelNames.forEach((channelName) => {
      const subscription = this.subscriptions.get(channelName);
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  /**
   * Unsubscribe from all subscriptions
   */
  static unsubscribeFromAllSubscriptions(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }

  /**
   * Get active subscription count
   */
  static getActiveSubscriptionCount(): number {
    return this.subscriptions.size;
  }

  /**
   * Get subscription status for a user
   */
  static getSubscriptionStatus(userId: string): {
    portfolioUpdates: boolean;
    analyticsUpdates: boolean;
  } {
    return {
      portfolioUpdates: this.subscriptions.has(`portfolio_updates_${userId}`),
      analyticsUpdates: this.subscriptions.has(`analytics_updates_${userId}`),
    };
  }

  /**
   * Broadcast a custom update to all subscribers of a user
   */
  static async broadcastUpdate(
    userId: string,
    update: Omit<RealtimePortfolioUpdate, "userId" | "timestamp">
  ): Promise<void> {
    try {
      const channelName = `custom_updates_${userId}`;

      const channel = supabase.channel(channelName);

      await channel.send({
        type: "broadcast",
        event: "custom_update",
        payload: {
          ...update,
          userId,
          timestamp: new Date().toISOString(),
        },
      });

      // Clean up the channel after sending
      supabase.removeChannel(channel);
    } catch (error) {
      console.error("Failed to broadcast update:", error);
    }
  }

  /**
   * Subscribe to custom updates for a user
   */
  static subscribeToCustomUpdates(
    userId: string,
    onUpdate: (update: RealtimePortfolioUpdate) => void
  ): RealtimeSubscription {
    const channelName = `custom_updates_${userId}`;

    // Unsubscribe from existing subscription if any
    if (this.subscriptions.has(channelName)) {
      this.subscriptions.get(channelName)?.unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on("broadcast", { event: "custom_update" }, (payload) => {
        console.log("Custom update received:", payload);

        const update: RealtimePortfolioUpdate = {
          ...payload.payload,
          timestamp: new Date(payload.payload.timestamp),
        };

        onUpdate(update);
      })
      .subscribe((status) => {
        console.log(
          `Custom updates subscription status for ${channelName}:`,
          status
        );
      });

    const subscription: RealtimeSubscription = {
      channel,
      unsubscribe: () => {
        console.log(`Unsubscribing from ${channelName}`);
        supabase.removeChannel(channel);
        this.subscriptions.delete(channelName);
      },
    };

    this.subscriptions.set(channelName, subscription);
    return subscription;
  }
}

