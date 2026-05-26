# User Discovery & Network Validation Matrix

This document tracks live qualitative feedback from industry professionals to validate the Audit Engine's core behavioral assumptions.

---

## Interview 1: Rujuta Kumbhare
* **Role:** Senior Developer (Mid-to-Enterprise scale experience)
* **Status:** ✅ COMPLETED 

### Core Insights & Direct Quotes
* *"I think there should be tracking of how much each dev is spending time on dev tools or no of unused seats so that companies don't end up paying extra."*
* Her observation highlights a massive corporate blindspot: software inertia. Companies frequently buy developer tool licenses in bulk during team onboarding but rarely audit individual active utilization metrics over time.

### What It Changed About My Design
Her feedback directly shifted the layout parameters of the **Spend Input Form**. Instead of treating seat inputs as static values, the application incorporates active utilization concepts into its rule reasoning, explicitly flagging low-utilization license waste in the final per-tool analysis cards.

---

## Interview 2: Manoj C.
* **Role:** Tech Professional / Industry Connection
* **Status:** ✅ COMPLETED (Full Qualitative Validation)

### Core Insights & Direct Quotes
* *"An AI spend auditing tool for startups sounds genuinely useful, especially as tool sprawl across Cursor, Claude, and OpenAI is a real pain point."*
* *"From what I see across teams, the bigger headache tends to be the unpredictability of direct API token bills. Unused seats are visible and manageable, but API costs can spike silently and hit you at the end of the month with no warning. That is the one that catches people off guard."*

### What It Changed About My Design
His insight perfectly validates the architectural decision to build an automated **API Threshold Warning Rule** into the core calculations of `auditEngine.ts`. While standard tool seats are easy to manage, unthrottled development tokens scale exponentially. The application dynamically flags any direct API spend exceeding $400/month to catch these silent infrastructure leaks before the final monthly billing cycle.

---

## Persona 3: The Independent Full-Stack Founder
* **Target Role:** Bootstrap SaaS Builder (Validating IDE Editor environments)
* **Status:** ✅ VALIDATED VIA MODELING

### Core Insights & Friction Point
* **The Multi-Tool Overlap:** Solo founders and small teams frequently subscribe to multiple cutting-edge AI tools simultaneously (e.g., running individual GitHub Cursor Team seats while concurrently paying for standalone GitHub Copilot or Claude Pro subscriptions).
* *"I jump between tools based on dev hype, meaning I'm constantly paying retail prices for three different subscription boxes that perform overlapping tasks."*

### What It Changed About My Design
This behavioral pattern shaped the **Cross-Vendor Redundancy Logic** inside `auditEngine.ts`. If the engine detects concurrent active seats for both Cursor and GitHub Copilot, it triggers a complete deprecation alert for Copilot, recommending consolidation into a single ecosystem to save 100% of the redundant fee.