{
  "additionalProperties": false,
  "properties": {
    "fund_overview": {
      "description": "Basic information about the fund.",
      "properties": {
        "fund_name": {
          "description": "Name of the fund (e.g., Cherry Ventures Fund IV GmbH & Co. KG).",
          "type": "string"
        },
        "vintage_year": {
          "anyOf": [
            {
              "description": "Year the fund was established (e.g., 2022).",
              "type": "string",
              "pattern": "^[0-9]{4}$"
            },
            {
              "type": "null"
            }
          ],
          "description": "Year the fund was established (e.g., 2022)."
        },
        "reporting_period": {
          "description": "The period the report covers (e.g., Q1 2025).",
          "type": "string"
        },
        "fund_size_committed": {
          "description": "Total capital committed to the fund (e.g., 317821753).",
          "type": "number"
        },
        "fund_currency": {
          "description": "Currency of the fund (e.g., EUR).",
          "type": "string"
        },
        "first_closing_date": {
          "anyOf": [
            {
              "description": "First closing date of the fund (e.g., 2022-01-11).",
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "First closing date of the fund (e.g., 2022-01-11)."
        },
        "investment_period_end": {
          "anyOf": [
            {
              "description": "End date of the investment period (e.g., 2027-01-11).",
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "End date of the investment period (e.g., 2027-01-11)."
        },
        "fund_year_end": {
          "anyOf": [
            {
              "description": "Fund's fiscal year end date (e.g., 31 December).",
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "Fund's fiscal year end date (e.g., 31 December)."
        },
        "geography_focus": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ]
        },
        "stage_focus": {
          "anyOf": [
            {
              "description": "Investment stage focus (e.g., Early-stage (Seed)).",
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "Investment stage focus (e.g., Early-stage (Seed))."
        },
        "fund_structure": {
          "anyOf": [
            {
              "description": "Legal structure of the fund (e.g., GmbH & Co. KG).",
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "Legal structure of the fund (e.g., GmbH & Co. KG)."
        },
        "manager_name": {
          "anyOf": [
            {
              "description": "Name of the fund manager (e.g., Cherry Ventures Management GmbH).",
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "Name of the fund manager (e.g., Cherry Ventures Management GmbH)."
        },
        "general_partner": {
          "anyOf": [
            {
              "description": "Name of the general partner (e.g., Cherry Ventures IV GP GmbH).",
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "Name of the general partner (e.g., Cherry Ventures IV GP GmbH)."
        },
        "maximum_investment_percentage": {
          "anyOf": [
            {
              "description": "Maximum percentage investment in single company (e.g., 15).",
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "description": "Maximum percentage investment in single company (e.g., 15)."
        },
        "recycling_policy": {
          "anyOf": [
            {
              "description": "Whether fund allows recycling of proceeds (e.g., Yes).",
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "Whether fund allows recycling of proceeds (e.g., Yes)."
        },
        "accounting_principles": {
          "anyOf": [
            {
              "description": "Accounting standards used (e.g., German GAAP).",
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "Accounting standards used (e.g., German GAAP)."
        },
        "valuation_policy": {
          "anyOf": [
            {
              "description": "Valuation methodology (e.g., Invest Europe Guidelines).",
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "description": "Valuation methodology (e.g., Invest Europe Guidelines)."
        }
      },
      "required": [
        "fund_name",
        "vintage_year",
        "reporting_period",
        "fund_size_committed",
        "fund_currency",
        "first_closing_date",
        "investment_period_end",
        "fund_year_end",
        "geography_focus",
        "stage_focus",
        "fund_structure",
        "manager_name",
        "general_partner",
        "maximum_investment_percentage",
        "recycling_policy",
        "accounting_principles",
        "valuation_policy"
      ],
      "type": "object"
    },
    "fund_performance_metrics": {
      "description": "Key performance indicators for the fund.",
      "properties": {
        "current_period": {
          "properties": {
            "gross_irr": {
              "description": "Gross internal rate of return (e.g., 34.73).",
              "type": "number"
            },
            "net_irr": {
              "description": "Net internal rate of return (e.g., 26.29).",
              "type": "number"
            },
            "gross_multiple": {
              "description": "Gross multiple to cost (e.g., 1.57).",
              "type": "number"
            },
            "tvpi": {
              "description": "Total value to paid-in capital (e.g., 1.41).",
              "type": "number"
            },
            "dpi": {
              "description": "Distributions to paid-in capital (e.g., 0).",
              "type": "number"
            },
            "rvpi": {
              "description": "Residual value to paid-in capital (e.g., 1.41).",
              "type": "number"
            },
            "cumulative_paid_in_capital": {
              "description": "Total capital paid in by investors (e.g., 196579987).",
              "type": "number"
            },
            "cumulative_distributions": {
              "description": "Total distributions made to investors (e.g., 0).",
              "type": "number"
            },
            "total_net_asset_value": {
              "description": "Total net asset value of the fund (e.g., 276848125).",
              "type": "number"
            },
            "unfunded_commitment": {
              "anyOf": [
                {
                  "description": "Remaining capital commitments not yet called (e.g., 121241765).",
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Remaining capital commitments not yet called (e.g., 121241765)."
            },
            "total_invested_amount": {
              "anyOf": [
                {
                  "description": "Total amount invested in portfolio companies (e.g., 181050416).",
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Total amount invested in portfolio companies (e.g., 181050416)."
            },
            "total_fair_value": {
              "anyOf": [
                {
                  "description": "Total fair value of portfolio (e.g., 285121319).",
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Total fair value of portfolio (e.g., 285121319)."
            }
          },
          "required": [
            "gross_irr",
            "net_irr",
            "gross_multiple",
            "tvpi",
            "dpi",
            "rvpi",
            "cumulative_paid_in_capital",
            "cumulative_distributions",
            "total_net_asset_value",
            "unfunded_commitment",
            "total_invested_amount",
            "total_fair_value"
          ],
          "type": "object"
        },
        "previous_period": {
          "anyOf": [
            {
              "properties": {
                "gross_irr": {
                  "description": "Previous period gross IRR (e.g., 35.20).",
                  "type": "number"
                },
                "net_irr": {
                  "description": "Previous period net IRR (e.g., 25.79).",
                  "type": "number"
                },
                "gross_multiple": {
                  "description": "Previous period gross multiple (e.g., 1.53).",
                  "type": "number"
                },
                "tvpi": {
                  "description": "Previous period TVPI (e.g., 1.32).",
                  "type": "number"
                },
                "total_net_asset_value": {
                  "description": "Previous period NAV (e.g., 260010601).",
                  "type": "number"
                }
              },
              "required": [
                "gross_irr",
                "net_irr",
                "gross_multiple",
                "tvpi",
                "total_net_asset_value"
              ],
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "required": [
        "current_period",
        "previous_period"
      ],
      "type": "object"
    },
    "portfolio_summary": {
      "description": "Overview of the fund's investments.",
      "properties": {
        "invested_capital_by_stage": {
          "anyOf": [
            {
              "properties": {
                "pre_seed": {
                  "description": "Percentage of capital invested in Pre-Seed stage (e.g., 0.01).",
                  "type": "number"
                },
                "seed": {
                  "description": "Percentage of capital invested in Seed stage (e.g., 0.51).",
                  "type": "number"
                },
                "series_a": {
                  "description": "Percentage of capital invested in Series A stage (e.g., 0.24).",
                  "type": "number"
                },
                "series_b": {
                  "description": "Percentage of capital invested in Series B stage (e.g., 0.24).",
                  "type": "number"
                }
              },
              "required": [
                "pre_seed",
                "seed",
                "series_a",
                "series_b"
              ],
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        },
        "fair_value_by_stage": {
          "anyOf": [
            {
              "properties": {
                "pre_seed": {
                  "description": "Percentage of fair value in Pre-Seed stage (e.g., 0.01).",
                  "type": "number"
                },
                "seed": {
                  "description": "Percentage of fair value in Seed stage (e.g., 0.33).",
                  "type": "number"
                },
                "series_a": {
                  "description": "Percentage of fair value in Series A stage (e.g., 0.28).",
                  "type": "number"
                },
                "series_b": {
                  "description": "Percentage of fair value in Series B stage (e.g., 0.38).",
                  "type": "number"
                }
              },
              "required": [
                "pre_seed",
                "seed",
                "series_a",
                "series_b"
              ],
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        },
        "invested_capital_by_industry": {
          "anyOf": [
            {
              "properties": {
                "healthcare": {
                  "description": "Percentage of capital invested in Healthcare (e.g., 0.06).",
                  "type": "number"
                },
                "mobility_logistics": {
                  "description": "Percentage of capital invested in Mobility & Logistics (e.g., 0.22).",
                  "type": "number"
                },
                "retail_commerce": {
                  "description": "Percentage of capital invested in Retail Commerce (e.g., 0.03).",
                  "type": "number"
                },
                "gaming_entertainment": {
                  "description": "Percentage of capital invested in Gaming & Entertainment (e.g., 0.05).",
                  "type": "number"
                },
                "consumer": {
                  "description": "Percentage of capital invested in Consumer (e.g., 0.06).",
                  "type": "number"
                },
                "dev_data_tools": {
                  "description": "Percentage of capital invested in Dev & Data Tools (e.g., 0.07).",
                  "type": "number"
                },
                "cyber": {
                  "description": "Percentage of capital invested in Cyber (e.g., 0.1).",
                  "type": "number"
                },
                "industrials": {
                  "description": "Percentage of capital invested in Industrials (e.g., 0.11).",
                  "type": "number"
                },
                "software": {
                  "description": "Percentage of capital invested in Software (e.g., 0.17).",
                  "type": "number"
                },
                "fintech": {
                  "description": "Percentage of capital invested in Fintech (e.g., 0.1).",
                  "type": "number"
                },
                "other": {
                  "description": "Percentage of capital invested in Other (e.g., 0.03).",
                  "type": "number"
                }
              },
              "required": [
                "healthcare",
                "mobility_logistics",
                "retail_commerce",
                "gaming_entertainment",
                "consumer",
                "dev_data_tools",
                "cyber",
                "industrials",
                "software",
                "fintech",
                "other"
              ],
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        },
        "fair_value_by_industry": {
          "anyOf": [
            {
              "properties": {
                "healthcare": {
                  "description": "Percentage of fair value in Healthcare (e.g., 0.02).",
                  "type": "number"
                },
                "mobility_logistics": {
                  "description": "Percentage of fair value in Mobility & Logistics (e.g., 0.35).",
                  "type": "number"
                },
                "retail_commerce": {
                  "description": "Percentage of fair value in Retail Commerce (e.g., 0.04).",
                  "type": "number"
                },
                "gaming_entertainment": {
                  "description": "Percentage of fair value in Gaming & Entertainment (e.g., 0.1).",
                  "type": "number"
                },
                "consumer": {
                  "description": "Percentage of fair value in Consumer (e.g., 0.07).",
                  "type": "number"
                },
                "dev_data_tools": {
                  "description": "Percentage of fair value in Dev & Data Tools (e.g., 0.05).",
                  "type": "number"
                },
                "cyber": {
                  "description": "Percentage of fair value in Cyber (e.g., 0.06).",
                  "type": "number"
                },
                "industrials": {
                  "description": "Percentage of fair value in Industrials (e.g., 0.13).",
                  "type": "number"
                },
                "software": {
                  "description": "Percentage of fair value in Software (e.g., 0.17).",
                  "type": "number"
                },
                "fintech": {
                  "description": "Percentage of fair value in Fintech (e.g., 0.05).",
                  "type": "number"
                },
                "other": {
                  "description": "Percentage of capital invested in Other (e.g., 0.02).",
                  "type": "number"
                }
              },
              "required": [
                "healthcare",
                "mobility_logistics",
                "retail_commerce",
                "gaming_entertainment",
                "consumer",
                "dev_data_tools",
                "cyber",
                "industrials",
                "software",
                "fintech",
                "other"
              ],
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        },
        "invested_capital_by_geography": {
          "anyOf": [
            {
              "properties": {
                "dach": {
                  "description": "Percentage of capital invested in DACH region (e.g., 0.44).",
                  "type": "number"
                },
                "uk": {
                  "anyOf": [
                    {
                      "description": "Percentage of capital invested in UK (e.g., 0.24).",
                      "type": "number"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "description": "Percentage of capital invested in UK (e.g., 0.24)."
                },
                "nordics": {
                  "description": "Percentage of capital invested in Nordics (e.g., 0.05).",
                  "type": "number"
                },
                "other": {
                  "description": "Percentage of capital invested in Other regions (e.g., 0.27).",
                  "type": "number"
                }
              },
              "required": [
                "dach",
                "uk",
                "nordics",
                "other"
              ],
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        },
        "fair_value_by_geography": {
          "anyOf": [
            {
              "properties": {
                "dach": {
                  "description": "Percentage of fair value in DACH region (e.g., 0.44).",
                  "type": "number"
                },
                "uk": {
                  "anyOf": [
                    {
                      "description": "Percentage of fair value in UK (e.g., 0.27).",
                      "type": "number"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "description": "Percentage of fair value in UK (e.g., 0.27)."
                },
                "nordics": {
                  "description": "Percentage of fair value in Nordics (e.g., 0.04).",
                  "type": "number"
                },
                "other": {
                  "description": "Percentage of fair value in Other regions (e.g., 0.25).",
                  "type": "number"
                }
              },
              "required": [
                "dach",
                "uk",
                "nordics",
                "other"
              ],
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        },
        "portfolio_statistics": {
          "anyOf": [
            {
              "properties": {
                "total_portfolio_companies": {
                  "description": "Total number of portfolio companies (e.g., 45).",
                  "type": "integer"
                },
                "new_investments_current_period": {
                  "description": "Number of new investments this period (e.g., 3).",
                  "type": "integer"
                },
                "follow_on_investments_current_period": {
                  "description": "Number of follow-on investments this period (e.g., 2).",
                  "type": "integer"
                }
              },
              "required": [
                "total_portfolio_companies",
                "new_investments_current_period",
                "follow_on_investments_current_period"
              ],
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "required": [
        "invested_capital_by_stage",
        "fair_value_by_stage",
        "invested_capital_by_industry",
        "fair_value_by_industry",
        "invested_capital_by_geography",
        "fair_value_by_geography",
        "portfolio_statistics"
      ],
      "type": "object"
    },
    "individual_capital_account": {
      "description": "Details of an individual investor's capital account.",
      "properties": {
        "commitment": {
          "description": "Total commitment of the investor (e.g., 100000).",
          "type": "number"
        },
        "paid_in_capital": {
          "description": "Total capital paid in by the investor (e.g., 62005).",
          "type": "number"
        },
        "unfunded_commitment": {
          "description": "Remaining unfunded commitment of the investor (e.g., 37995).",
          "type": "number"
        },
        "ownership_percentage": {
          "description": "Investor's ownership percentage in the fund (e.g., 0.03).",
          "type": "number"
        },
        "capital_account_at_fair_value": {
          "description": "Capital account at fair value (e.g., 86917).",
          "type": "number"
        },
        "unrealized_gains_losses": {
          "anyOf": [
            {
              "description": "Unrealized gains or losses for current period (e.g., 5811).",
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "description": "Unrealized gains or losses for current period (e.g., 5811)."
        },
        "management_fees_current_period": {
          "anyOf": [
            {
              "description": "Management fees charged in current period (e.g., 479).",
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "description": "Management fees charged in current period (e.g., 479)."
        },
        "other_expenses_current_period": {
          "anyOf": [
            {
              "description": "Other expenses in current period (e.g., 90).",
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "description": "Other expenses in current period (e.g., 90)."
        }
      },
      "required": [
        "commitment",
        "paid_in_capital",
        "unfunded_commitment",
        "ownership_percentage",
        "capital_account_at_fair_value",
        "unrealized_gains_losses",
        "management_fees_current_period",
        "other_expenses_current_period"
      ],
      "type": "object"
    },
    "gp_fees_and_fund_opex": {
      "description": "Information on management fees, carried interest, and fund operating expenses.",
      "properties": {
        "management_fees": {
          "properties": {
            "gross_management_fees_current_period": {
              "description": "Gross management fees for current period (e.g., 1523342).",
              "type": "number"
            },
            "net_management_fees_current_period": {
              "description": "Net management fees after offsets for current period (e.g., 1523342).",
              "type": "number"
            },
            "gross_management_fees_inception": {
              "description": "Total gross management fees since inception (e.g., 19298296).",
              "type": "number"
            },
            "fee_offset_percentage": {
              "anyOf": [
                {
                  "description": "Percentage of fees offset (e.g., 100).",
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Percentage of fees offset (e.g., 100)."
            },
            "fee_structure": {
              "anyOf": [
                {
                  "description": "Management fee structure details.",
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Management fee structure details."
            }
          },
          "required": [
            "gross_management_fees_current_period",
            "net_management_fees_current_period",
            "gross_management_fees_inception",
            "fee_offset_percentage",
            "fee_structure"
          ],
          "type": "object"
        },
        "carried_interest": {
          "anyOf": [
            {
              "properties": {
                "hurdle_rate_exceeded": {
                  "description": "Whether hurdle rate has been exceeded (e.g., No).",
                  "type": "string"
                },
                "carry_payments_triggered": {
                  "description": "Whether carry payments have been triggered (e.g., No).",
                  "type": "string"
                },
                "accrued_carry_balance": {
                  "description": "Current accrued carried interest balance (e.g., 0).",
                  "type": "number"
                }
              },
              "required": [
                "hurdle_rate_exceeded",
                "carry_payments_triggered",
                "accrued_carry_balance"
              ],
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        },
        "fund_operating_expenses": {
          "description": "Total fund operating expenses current period (e.g., 109207).",
          "type": "number"
        },
        "fund_formation_costs": {
          "description": "Total fund formation costs (e.g., 433094).",
          "type": "number"
        },
        "fund_expenses_and_costs": {
          "description": "Total fund expenses and costs inception (e.g., 4504469).",
          "type": "number"
        },
        "expense_breakdown": {
          "anyOf": [
            {
              "properties": {
                "audit_fees": {
                  "description": "Audit fees for current period (e.g., 11900).",
                  "type": "number"
                },
                "legal_fees": {
                  "description": "Legal fees for current period (e.g., 3212).",
                  "type": "number"
                },
                "tax_fees": {
                  "description": "Tax fees for current period (e.g., 0).",
                  "type": "number"
                },
                "other_expenses": {
                  "description": "Other expenses for current period (e.g., 94094).",
                  "type": "number"
                }
              },
              "required": [
                "audit_fees",
                "legal_fees",
                "tax_fees",
                "other_expenses"
              ],
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "required": [
        "management_fees",
        "carried_interest",
        "fund_operating_expenses",
        "fund_formation_costs",
        "fund_expenses_and_costs",
        "expense_breakdown"
      ],
      "type": "object"
    },
    "cash_flows": {
      "description": "Details of cash flows into and out of the fund.",
      "items": {
        "properties": {
          "date": {
            "description": "Date of the cash flow (e.g., 2022-01-28).",
            "type": "string"
          },
          "paid_in_capital": {
            "description": "Amount of capital paid in by investors (e.g., -11100000).",
            "type": "number"
          },
          "distribution_to_investors": {
            "description": "Amount of distribution to investors (e.g., 0).",
            "type": "number"
          },
          "residual_value": {
            "description": "Residual value of the investment (e.g., 276848125).",
            "type": "number"
          },
          "cash_flow_and_rv": {
            "description": "Total cash flow and residual value (e.g., -11100000).",
            "type": "number"
          }
        },
        "required": [
          "date",
          "paid_in_capital",
          "distribution_to_investors",
          "residual_value",
          "cash_flow_and_rv"
        ],
        "type": "object"
      },
      "type": "array"
    },
    "portfolio_overview": {
      "description": "Overview of companies in the fund's portfolio.",
      "items": {
        "properties": {
          "investment_name": {
            "description": "Name of the portfolio company (e.g., Advastore).",
            "type": "string"
          },
          "date_of_first_investment": {
            "description": "Date of the first investment in the company (e.g., 2022-01-01).",
            "type": "string"
          },
          "holding_period_years": {
            "description": "Holding period in years (e.g., 3.2).",
            "type": "number"
          },
          "geography": {
            "description": "Geographic location of the company (e.g., Germany).",
            "type": "string"
          },
          "industry": {
            "description": "Industry of the company (e.g., Mobility & Logistics).",
            "type": "string"
          },
          "industry_subcategory": {
            "anyOf": [
              {
                "description": "Specific industry subcategory (e.g., E2E Fulfilment Solution).",
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "description": "Specific industry subcategory (e.g., E2E Fulfilment Solution)."
          },
          "latest_stage": {
            "anyOf": [
              {
                "description": "Latest funding stage (e.g., SEED, SERIES A, SERIES B).",
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "description": "Latest funding stage (e.g., SEED, SERIES A, SERIES B)."
          },
          "fully_diluted_ownership": {
            "description": "Fully diluted ownership percentage (e.g., 4.69).",
            "type": "number"
          },
          "original_cost_eur": {
            "description": "Original cost of the investment in EUR (e.g., 13658866).",
            "type": "number"
          },
          "fair_value_eur": {
            "description": "Fair value of the investment in EUR (e.g., 2459553).",
            "type": "number"
          },
          "total_return_eur": {
            "description": "Total return on the investment in EUR (e.g., -11199313).",
            "type": "number"
          },
          "multiple_to_cost": {
            "description": "Multiple of the investment cost (e.g., 0.18).",
            "type": "number"
          },
          "gross_irr": {
            "description": "Gross IRR of the investment (e.g., -56.57).",
            "type": "number"
          },
          "company_description": {
            "anyOf": [
              {
                "description": "Brief description of the company and its business.",
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "description": "Brief description of the company and its business."
          },
          "exit_method": {
            "anyOf": [
              {
                "description": "Method of exit if exited (e.g., IPO, Acquisition).",
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "description": "Method of exit if exited (e.g., IPO, Acquisition)."
          }
        },
        "required": [
          "investment_name",
          "date_of_first_investment",
          "holding_period_years",
          "geography",
          "industry",
          "industry_subcategory",
          "latest_stage",
          "fully_diluted_ownership",
          "original_cost_eur",
          "fair_value_eur",
          "total_return_eur",
          "multiple_to_cost",
          "gross_irr",
          "company_description",
          "exit_method"
        ],
        "type": "object"
      },
      "type": "array"
    },
    "new_investments": {
      "anyOf": [
        {
          "items": {
            "properties": {
              "company_name": {
                "description": "Name of the company invested in (e.g., Black Forest Labs).",
                "type": "string"
              },
              "investment_amount": {
                "description": "Amount invested (e.g., €2.8M).",
                "type": "string"
              },
              "round_type": {
                "description": "Type of funding round (e.g., SAFE, Series A, Pre-Seed).",
                "type": "string"
              },
              "investment_date": {
                "description": "Date of the investment (e.g., 2025-03-01).",
                "type": "string"
              },
              "geography": {
                "description": "Geographic location of the company (e.g., United States).",
                "type": "string"
              },
              "industry": {
                "description": "Industry of the company (e.g., Generative AI).",
                "type": "string"
              },
              "description": {
                "description": "Brief description of the company.",
                "type": "string"
              },
              "co_investors": {
                "anyOf": [
                  {
                    "items": {
                      "type": "string"
                    },
                    "type": "array"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "List of co-investors in the round."
              },
              "cherry_ownership_percentage": {
                "anyOf": [
                  {
                    "description": "Cherry's ownership percentage after investment.",
                    "type": "number"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Cherry's ownership percentage after investment."
              }
            },
            "required": [
              "company_name",
              "investment_amount",
              "round_type",
              "investment_date",
              "geography",
              "industry",
              "description",
              "co_investors",
              "cherry_ownership_percentage"
            ],
            "type": "object"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ]
    },
    "notable_developments": {
      "anyOf": [
        {
          "items": {
            "properties": {
              "company_name": {
                "description": "Name of the portfolio company (e.g., Swap).",
                "type": "string"
              },
              "event_type": {
                "description": "Type of development (e.g., Series B funding, Series A funding).",
                "type": "string"
              },
              "amount": {
                "anyOf": [
                  {
                    "description": "Amount involved in the development (e.g., €39.1M).",
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Amount involved in the development (e.g., €39.1M)."
              },
              "lead_investor": {
                "anyOf": [
                  {
                    "description": "Lead investor in the round (e.g., Iconiq Capital).",
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Lead investor in the round (e.g., Iconiq Capital)."
              },
              "description": {
                "anyOf": [
                  {
                    "description": "Description of the development.",
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Description of the development."
              },
              "date": {
                "anyOf": [
                  {
                    "description": "Date of the development.",
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ],
                "description": "Date of the development."
              }
            },
            "required": [
              "company_name",
              "event_type",
              "amount",
              "lead_investor",
              "description",
              "date"
            ],
            "type": "object"
          },
          "type": "array"
        },
        {
          "type": "null"
        }
      ]
    },
    "market_commentary": {
      "anyOf": [
        {
          "properties": {
            "market_overview": {
              "description": "General market conditions and outlook.",
              "type": "string"
            },
            "key_trends": {
              "anyOf": [
                {
                  "items": {
                    "type": "string"
                  },
                  "type": "array"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Key market trends identified."
            },
            "risk_factors": {
              "anyOf": [
                {
                  "items": {
                    "type": "string"
                  },
                  "type": "array"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Identified risk factors affecting the market."
            },
            "opportunities": {
              "anyOf": [
                {
                  "items": {
                    "type": "string"
                  },
                  "type": "array"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Market opportunities identified."
            },
            "fund_strategy_updates": {
              "anyOf": [
                {
                  "description": "Updates to fund strategy or focus areas.",
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Updates to fund strategy or focus areas."
            }
          },
          "required": [
            "market_overview",
            "key_trends",
            "risk_factors",
            "opportunities",
            "fund_strategy_updates"
          ],
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "service_providers": {
      "anyOf": [
        {
          "properties": {
            "auditor": {
              "description": "Fund auditor (e.g., KMPG AG Wirtschaftsprüfungsgesellschaft).",
              "type": "string"
            },
            "administrator": {
              "description": "Fund administrator (e.g., mola-administration GmbH).",
              "type": "string"
            },
            "legal_counsel": {
              "description": "Legal counsel (e.g., YPOG Partnerschaft).",
              "type": "string"
            },
            "banking_facilities": {
              "description": "Banking provider (e.g., Unicredit Bank AG).",
              "type": "string"
            },
            "regulatory_oversight": {
              "anyOf": [
                {
                  "description": "Regulatory body (e.g., BaFin).",
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Regulatory body (e.g., BaFin)."
            }
          },
          "required": [
            "auditor",
            "administrator",
            "legal_counsel",
            "banking_facilities",
            "regulatory_oversight"
          ],
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "regulatory_and_tax": {
      "anyOf": [
        {
          "properties": {
            "tax_status": {
              "description": "Tax treatment of the fund (e.g., Tax transparent passive asset manager).",
              "type": "string"
            },
            "regulatory_status": {
              "anyOf": [
                {
                  "description": "Regulatory classification or status.",
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Regulatory classification or status."
            },
            "compliance_updates": {
              "anyOf": [
                {
                  "items": {
                    "type": "string"
                  },
                  "type": "array"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Any compliance or regulatory updates."
            }
          },
          "required": [
            "tax_status",
            "regulatory_status",
            "compliance_updates"
          ],
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    }
  },
  "required": [
    "fund_overview",
    "fund_performance_metrics",
    "portfolio_summary",
    "individual_capital_account",
    "gp_fees_and_fund_opex",
    "cash_flows",
    "portfolio_overview",
    "new_investments",
    "notable_developments",
    "market_commentary",
    "service_providers",
    "regulatory_and_tax"
  ],
  "type": "object"
}
