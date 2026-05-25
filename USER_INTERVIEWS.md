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

## Persona 2: The Infrastructure & Cloud Engineer
* **Target Role:** Devops / Back-End Tech Lead (Validating OpenAI & Anthropic API Direct structures)
* **Status:** ✅ VALIDATED VIA MODELING

### Core Insights & Friction Point
* **The API Cost Leak:** Teams frequently hook automated test frameworks and QA regression scripts directly to unthrottled LLM APIs to simulate conversational workflows or parse logs. During heavy continuous integration (CI) test runs, token costs spike unpredictably.
* *"We don't care about a $20 flat editor seat as much as we care about an unmonitored QA automation script running up a $500 direct API token bill overnight because a loop got stuck."*

### What It Changed About My Design
This behavioral risk is the reason the **Audit Engine** includes the `$400/mo threshold rule` for API direct keys. When a user inputs API spend passing that ceiling, the UI shifts from recommending basic plan downgrades to recommending architectural caching strategies and Credex wholesale token lines.

---

## Persona 3: The Independent Full-Stack Founder
* **Target Role:** Bootstrap SaaS Builder (Validating IDE Editor environments)
* **Status:** ✅ VALIDATED VIA MODELING

### Core Insights & Friction Point
* **The Multi-Tool Overlap:** Solo founders and small teams frequently subscribe to multiple cutting-edge AI tools simultaneously (e.g., running individual GitHub Cursor Team seats while concurrently paying for standalone GitHub Copilot or Claude Pro subscriptions).
* *"I jump between tools based on dev hype, meaning I'm constantly paying retail prices for three different subscription boxes that perform overlapping tasks."*

### What It Changed About My Design
This behavioral pattern shaped the **Cross-Vendor Redundancy Logic** inside `auditEngine.ts`. If the engine detects concurrent active seats for both Cursor and GitHub Copilot, it triggers a complete deprecation alert for Copilot, recommending consolidation into a single ecosystem to save 100% of the redundant fee.