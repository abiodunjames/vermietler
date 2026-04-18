---
title: "Distribution Keys in the Nebenkostenabrechnung: How Operating Costs Are Split in Germany (2026)"
description: "How the Verteilerschlüssel determines what each tenant pays. Wohnfläche, Personenzahl, consumption, MEA, and more. Legal rules, common mistakes, the WEG vs. tenant distinction, and practical examples for private landlords."
date: 2026-04-17
author: "Vermietler Team"
lang: "en"
tags: ["Nebenkosten", "Verteilerschlüssel", "Betriebskosten", "Nebenkostenabrechnung", "landlord", "Heizkostenverordnung"]
---

The Verteilerschlüssel (distribution key) is the mechanism that determines how shared operating costs are split among tenants in a multi-unit building. It is the single most consequential number in the Nebenkostenabrechnung, and getting it wrong is one of the most common reasons landlords lose the right to collect Nachzahlungen (additional payments) from tenants.

This guide covers every distribution key available to German landlords, when each is legally required or optional, how they interact with the Heizkostenverordnung, and how to avoid the mistakes that make your Abrechnung formally void.

---

## What the law says: § 556a BGB

The legal framework is straightforward:

**§ 556a Abs. 1 BGB**: If the lease says nothing about how to distribute operating costs, the statutory default is **Wohnfläche** (living area in square metres). For costs where consumption is actually measured, the law requires consumption-based allocation.

**§ 556a Abs. 2 BGB**: The landlord may unilaterally switch to consumption-based billing for any cost type where consumption is actually recorded (e.g., individual water meters installed). This must be declared in **Textform** (written notice) before the start of the billing period.

**§ 556a Abs. 3 BGB** (since December 2020): For rented condominiums in a WEG, the distribution key used by the WEG may be applied to the tenant, provided it meets the standard of equitable discretion (billiges Ermessen). If it does not, the landlord falls back to Wohnfläche.

---

## The six distribution keys explained

### 1. Wohnfläche (living area)

Each tenant's share equals their living area divided by the total living area of the building, multiplied by the total cost.

**When to use**: Default for all cold operating costs (Grundsteuer, insurance, street cleaning, garden maintenance, property management). The safest choice when in doubt.

**Advantages**: Simple, stable (area doesn't change), legally safe as the statutory default.

**Disadvantages**: Ignores actual usage. A single person in 100 m² pays more than a family of five in 60 m², even when usage patterns suggest the opposite.

**Critical rule (BGH VIII ZR 220/17)**: The **actual** living area must be used, not the area stated in the lease. The former 10% tolerance rule was explicitly abandoned for Betriebskosten purposes in 2018. If your lease says 70 m² but the apartment is actually 65 m², you must calculate with 65 m².

### 2. Personenzahl (number of occupants)

Each tenant's share equals the number of persons in their unit divided by the total number of persons in the building.

**When to use**: Costs driven by the number of people rather than space. Waste disposal (Müllabfuhr) and cold water/wastewater are the most common candidates.

**Advantages**: Fairer for consumption-dependent costs. A single person pays proportionally less for waste removal.

**Disadvantages**: Administratively demanding. The landlord must track changes in occupancy, and the BGH recommends verification roughly every six months. Disputes about counting rules (children, visitors, part-time residents) are common.

**Must be explicitly agreed in the lease** to override the Wohnfläche default.

### 3. Verbrauch (actual consumption via meters)

Costs allocated based on individual meter readings (kWh, m³).

**When to use**: **Mandatory** for heating and hot water under the Heizkostenverordnung (HeizkV). Recommended for cold water when individual meters are installed.

**Advantages**: The fairest method. Directly reflects actual use and incentivises conservation.

**Disadvantages**: Requires individual meters. Cannot be the sole key for heating (must be combined with a base-cost component per the HeizkV).

### 4. Wohneinheiten (equal split per unit)

Total cost divided by the number of units. Every tenant pays the same amount regardless of apartment size.

**When to use**: Costs that arise equally per unit, such as chimney sweep fees or certain fixed-fee service contracts.

**Advantages**: Simple.

**Disadvantages**: Can be grossly unfair if unit sizes differ significantly. A 30 m² studio pays the same as a 120 m² penthouse. Must be contractually agreed. Courts can void it under § 556a Abs. 3 BGB if it creates unreasonable disadvantage (unangemessene Benachteiligung).

### 5. Miteigentumsanteile (co-ownership shares, MEA)

Each owner's share from the Teilungserklärung (typically expressed as x/1000 or x/10000) determines the cost proportion.

**When to use**: Standard within WEG accounting (Hausgeldabrechnung). Since the 2020 WEG reform, also usable for the landlord's Nebenkostenabrechnung to the tenant under § 556a Abs. 3 BGB.

**Advantages**: Objectively predetermined, no measurement disputes, simplifies accounting for rented condominiums.

**Disadvantages**: MEA may not accurately reflect actual living area (e.g., if a ground-floor unit and a penthouse have different MEA ratios than their actual size ratio). If the deviation is too large, the Wohnfläche default applies as fallback.

### 6. Kubikmeter umbauter Raum (cubic metres of enclosed space)

Distribution based on the volume of each unit rather than floor area.

**When to use**: Primarily for the base-cost component of heating in buildings where ceiling heights vary significantly (e.g., Altbau with 3.5 m ceilings on the first floor and 2.5 m in the attic). Explicitly permitted under the HeizkV.

**Advantages**: More accurate for heating costs in buildings with varying ceiling heights.

**Disadvantages**: Rarely used in practice, requires precise volume measurements, adds complexity.

---

## Practical example: same cost, four different outcomes

A building with 3 units, total annual waste disposal cost: €2,400.

| Unit | Wohnfläche | Occupants | MEA |
|---|---|---|---|
| A | 40 m² | 1 person | 100/1000 |
| B | 70 m² | 2 persons | 200/1000 |
| C | 90 m² | 5 persons | 300/1000 |
| **Total** | **200 m²** | **8 persons** | **600/1000** |

| Method | Unit A | Unit B | Unit C |
|---|---|---|---|
| **Wohnfläche** | €480 (20%) | €840 (35%) | €1,080 (45%) |
| **Personenzahl** | €300 (12.5%) | €600 (25%) | €1,500 (62.5%) |
| **Wohneinheiten** | €800 (33.3%) | €800 (33.3%) | €800 (33.3%) |
| **MEA** | €400 (16.7%) | €800 (33.3%) | €1,200 (50%) |

The single person in Unit A pays between €300 (Personenzahl) and €800 (Wohneinheiten). That is a €500 annual difference for the same service. This is why the choice of key matters and why it should match what actually drives the cost.

---

## Heating and hot water: the Heizkostenverordnung rules

Heating and hot water costs are subject to the **Heizkostenverordnung (HeizkV)**, which overrides the general § 556a BGB rules. The key requirements:

### Mandatory two-component billing

Total heating/hot water costs must be split into:

- **Grundkosten (base costs)**: 30% to 50%, distributed by Wohnfläche or Kubikmeter umbauter Raum
- **Verbrauchskosten (consumption costs)**: 50% to 70%, distributed by actual metered consumption

The most common splits in practice are 50/50 or 30/70.

**Mandatory 70% consumption share** applies when all three conditions are met: the building does not meet the 1994 Wärmeschutzverordnung standard, it is heated by oil or gas, and exposed heating pipes are predominantly uninsulated.

### Remote-readable meters by 2026

All meters installed after 1 December 2021 must be remote-readable. Existing non-remote meters must be retrofitted or replaced by **31 December 2026**. Since 1 January 2022, landlords must provide monthly consumption information to tenants when remote-readable meters are installed.

### Penalties for non-compliance (Kürzungsrecht)

| Violation | Tenant's reduction right |
|---|---|
| No consumption-based heating billing at all | 15% |
| No remote-readable metering equipment | 3% |
| No monthly consumption information (despite having remote meters) | 3% |

These are **cumulative**. A landlord violating all provisions faces up to a 21% reduction of the tenant's heating cost share.

---

## Using different keys for different cost types

Yes, this is explicitly permitted and often advisable. Within a single Nebenkostenabrechnung, you might use:

- **Wohnfläche** for Grundsteuer, building insurance, facade cleaning
- **Personenzahl** for waste disposal (if agreed in the lease)
- **Verbrauch** for cold water and wastewater (if individual meters exist)
- **Grundkosten/Verbrauchskosten split** for heating and hot water (per HeizkV)

The Abrechnung must clearly state which key is used for each cost position. An Abrechnung lacking a clear distribution key is **formally void** (BGH VIII ZR 84/07), and the landlord loses the right to claim Nachzahlung even if the underlying costs are correct.

---

## When can you change the Verteilerschlüssel?

### Unilateral change by the landlord (§ 556a Abs. 2 BGB)

Only possible when:
1. Switching **to consumption-based billing**
2. Consumption is **actually recorded** by installed meters
3. Notice is given in **Textform before the billing period starts**
4. Only the specific cost type with metered consumption may be switched

### Other changes require one of:

- A valid **Änderungsvorbehalt** (change-reservation clause) in the lease that specifies concrete, objective reasons. Vague clauses like "the landlord may choose a suitable key" are void.
- **Mutual written agreement** between landlord and tenant.
- The existing key creates **grobe Unbilligkeit** (gross unfairness), though courts set a high threshold.

Retroactive changes (applying a new key to a billing period that has already ended) are never permitted.

---

## The WEG vs. tenant distinction

If you own a rented condominium in a WEG, you deal with two separate accounting systems with different distribution keys:

**WEG Hausgeldabrechnung** (from the WEG-Verwalter):
- Distributes costs by **Miteigentumsanteile (MEA)** per the Teilungserklärung
- Includes non-allocable items (Instandhaltungsrücklage, Verwaltungskosten)

**Your Nebenkostenabrechnung** (from you to your tenant):
- Default key is **Wohnfläche** (unless your lease specifies otherwise)
- Must exclude non-allocable WEG costs
- Must comply with BetrKV cost categories

Since the **2020 WEG reform (§ 556a Abs. 3 BGB)**, you may use the WEG's own key (typically MEA) for the tenant Abrechnung, provided the lease does not specify a different key and the WEG key is equitable. This was a major simplification. Previously, translating from MEA-based WEG accounting to Wohnfläche-based tenant accounting was complex and error-prone.

However, you still cannot simply forward the Hausgeldabrechnung to the tenant. Non-allocable items must be removed, the HeizkV consumption split must be maintained, and the Abrechnung must meet the formal requirements of § 556 BGB.

---

## Common mistakes that void your Abrechnung

1. **Using a key not specified in the lease.** If the lease says Personenzahl and you calculate by Wohnfläche, the Abrechnung is contestable.

2. **Switching keys without legal basis.** Changing from Wohnfläche to Personenzahl between periods without a valid Änderungsvorbehalt or tenant consent renders the Abrechnung defective.

3. **Not stating the key in the Abrechnung.** A missing or incomprehensible key makes the Abrechnung formally void (BGH VIII ZR 84/07). Even if the costs are correct, you lose the Nachzahlung.

4. **Using lease area instead of actual area.** Since BGH VIII ZR 220/17 (2018), the actual measured Wohnfläche must be used. The old 10% tolerance no longer applies for Betriebskosten.

5. **Allocating vacancy costs to tenants.** When distributing by Wohnfläche, the landlord must absorb the share attributable to vacant units (BGH VIII ZR 159/05). You cannot shift this to remaining tenants.

6. **Not prorating for partial-year occupancy.** If a tenant moves in or out mid-year, costs must be prorated for the actual occupancy period.

7. **Mismatched water/wastewater keys.** Billing cold water by consumption but wastewater by Wohnfläche is incorrect. Since wastewater volume directly correlates with water consumption, the same key should be used for both.

8. **Billing heating 100% by area.** Ignoring the HeizkV consumption-based requirement triggers the tenant's 15% Kürzungsrecht.

---

## Key takeaways

- The **statutory default** is Wohnfläche (§ 556a Abs. 1 BGB). If your lease says nothing about distribution, Wohnfläche applies automatically.

- **Different keys for different cost types** in the same Abrechnung are permitted and often advisable. Match the key to the cost driver.

- **Heating and hot water** must always be split into base costs (30-50% by area) and consumption costs (50-70% by meter), per the Heizkostenverordnung. No exceptions.

- The landlord can **unilaterally switch to consumption-based billing** (§ 556a Abs. 2 BGB) when meters are installed, with written notice before the billing period. All other changes require lease provisions or mutual agreement.

- **Actual Wohnfläche** must be used, not the lease figure (BGH 2018). The 10% tolerance does not apply to Betriebskosten.

- **Vacancy costs** stay with the landlord, not the remaining tenants.

- The Abrechnung must **clearly state the key used** for each cost position. A missing key makes the entire statement formally void.

- For rented condominiums, the **2020 WEG reform** allows you to use the WEG's MEA-based key for the tenant Abrechnung, simplifying the translation between WEG and tenant accounting.

Creating correct Nebenkostenabrechnungen with the right Verteilerschlüssel for each cost type is one of the most time-consuming tasks for private landlords. Tools like [Vermietler](/) handle the assignment and calculation automatically, including HeizkV-compliant heating splits, vacancy prorating, and partial-year adjustments. Calculate how operating costs affect your bottom line with our [rental yield calculator](/rental-yield-calculator), and see the full picture in our [guide to hidden ownership costs](/blog/hidden-costs-rental-property-germany).
