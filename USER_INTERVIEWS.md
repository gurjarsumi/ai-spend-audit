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

## Interview 2: Professional Network Contact (Pending)
* **Target Role:** Backend / Cloud Infrastructure Engineer
* **Status:** ⏳ PENDING RESPONSE (Outreach active via LinkedIn)
* *Note: Tracking insights regarding unmonitored script loops hitting direct LLM APIs (OpenAI/Anthropic) and running up unpredictable token bills. Document will be updated upon receipt of reply (Expected Monday/Tuesday).*

---

## Interview 3: Professional Network Contact (Pending)
* **Target Role:** Product Validation / QA Engineer
* **Status:** ⏳ PENDING RESPONSE (Outreach active via LinkedIn)
* *Note: Tracking verification parameters and dashboard data trust metrics. Document will be updated upon receipt of reply (Expected Monday/Tuesday).*