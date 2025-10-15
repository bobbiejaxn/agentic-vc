# 1st message

Für den Start/ wären die Basics: Auf Fund Ebene (mit Merantix als Beispiel)

General: Fund Name (Merantix Capital AI Fund), Vintage year (e.g. 2020); Reporting Quarter (e.g. Q1 2025) Total Commited Capital/Fund Size (30,524.5), Total Capital Calls (28,082.2)

Performance: MOIC/ Gross investment multiple (1.3x) ; TVPI (0.8x), DPI (0.8x), RVPI (0.8x), Gross IRR (5.4%) , Net IRR (n/m), Paid-in capital to committed capital (PIC) (0.9x)

Wichtig für dich ist halt v.a. noch das Capital Account Statement: sprich wie viel ist dein Commitment heute wert: Net Asset Value

Am Anfang wäre es glaube ich am übersichtlichsten das mal in Google Sheets zu packen (pro Fund ein Sheet), wenn das ganze mal etabliert ist kann man ja überlegen ob & wie man hier more sophisticated Datenstrukturen aufbaut.

Fund Name (Merantix Capital AI Fund), Vintage year (e.g. 2020) —> muss nur einmalig gemacht werden, bleibt danach für jedes Quartal gleich (sprich könnte man auch händisch machen)

---

# 2nd message

Nice to have
Portfolio Ebene: Comany name, Date of inital invest, Fair Value, Cost, MOIC, Realized Value
—> wäre natürlich top, wenn man hier mit der Zeit auch eine Datenbasis per Company aufbauen kann, aber erstmal zweitrangig

---

# 3rd message

Für den Agenten:
•⁠ ⁠wäre tatsächlich beides sinnvoll
•⁠ ⁠⁠Google Sheets legt ein bekannter von mir manuell an
•⁠ ⁠⁠für mich sehr wertvoll die underlying companies und deren Performance

Hier noch ein paar Gedanken dazu falls der Agent Feeback zu dem Output braucht:

Für die Fund overview wäre es cool wenn er alle KPIs ziehen könnte:
MOIC/ Gross investment multiple (1.3x) ; TVPI (0.8x), DPI (0.8x), RVPI (0.8x), Gross IRR (5.4%) , Net IRR (n/m), Paid-in capital to committed capital (PIC) (0.9x)

Die Portfolio Companies summaries sehen schon echt gut aus!

Wäre top, wenn der Agent die Current Valuation & Current Fully Dilluted Ownership pro Company noch ziehen könnte.

Total Invested & Fair Values sind jeweils im Report in tausend Euro angegeben sprich: Deltai Invested: €1.476.200 —> LLM hat €1K. Die invested amounts & fair values scheint er noch nicht richtig/ungenau zu ziehen bei allen companies.

In was für einem Datenform kriegst du das? Kann man das in Google Sheets synchronisieren?

# 4th message

ch glaube auf Fund Performance Ebene ist es fast leichter, die Performance KPIs aus den Quarterly Reports zu nehmen (MOIC, TvPI etc.)

Man kann manche Kennzahlen ggf. querchecken aber würde nicht alles bottom up rechnen (wird schnell sehr komplex).

Für die Ebene braucht man auch noch mal andere Daten (aus dem Capital Account Statement), dass steht oft nicht in den Quarterlies
