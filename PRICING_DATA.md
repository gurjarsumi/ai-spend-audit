# AI Workspace Tool Pricing Matrix (Standard Baselines)

This document maps the standard, hardcoded industry baseline pricing parameters used by the Audit Engine to calculate operational overspend and optimization thresholds.

## Core Matrix Mappings

| Tool Identifier | Core Pricing Tiers Enforced | Cost Parameter | Audit Fallback Group |
| :--- | :--- | :--- | :--- |
| **Cursor AI** | Pro / Individual<br>Team / Business | $20 / user / mo<br>$40 / user / mo | Standard Seats (Pro Floor) |
| **GitHub Copilot** | Individual<br>Business | $10 / user / mo<br>$19 / user / mo | Redundant Workspace Class |
| **Claude AI** | Pro<br>Team | $20 / user / mo<br>$30 / user / mo | 5-Seat Floor Rule Enforced |
| **ChatGPT** | Plus / Pro<br>Team | $20 / user / mo<br>$25 / user / mo | Redundant Chat Ecosystem |
| **Gemini** | Pro | $20 / user / mo | Non-Friction Longtail |
| **Windsurf** | Pro | $20 / user / mo | Non-Friction Longtail |
| **Anthropic API** | API direct | Pay-as-you-go | $400/mo Threshold Cap Rule |
| **OpenAI API** | API direct | Pay-as-you-go | $400/mo Threshold Cap Rule |

## Fallback Protocols
When an arbitrary or unrecognizable custom string token is parsed in the input fields (e.g., "Custom Enterprise Scale Tier"), the engine normalizes the text mapping and applies a default flat floor value of **$20/seat/month** as a defensive buffer to prevent calculations from returning NaN or crashing the interface.