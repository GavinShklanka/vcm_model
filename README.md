# Nova Scotia Road Safety Intelligence System

**Vehicle Collision Severity Prediction Model (VCM)**

This repository houses the final evaluation and delivery of a machine learning intelligence system designed to predict traffic collision severity (Severe vs. Non-Severe) utilizing exposure, environmental, and conditional risk data across Nova Scotia corridors.

## Project Purpose & Vision
This project functions as a **severity-conditional-on-collision risk prioritization system**. Rather than acting as a deterministic crash predictor, the framework provides a data-driven method for ranking relative regional risk, equipping policymakers and transportation planners with actionable insights for proactive network monitoring.

## Key Findings & Results Interpretation
- **Algorithm Performance:** **XGBoost** proved to be the best-performing model (AUC **0.642**), effectively capturing complex, non-linear interactions. **Logistic Regression** served as a reliable, transparent baseline (AUC **0.604**). 
- **The Role of Complexity:** Notably, **Random Forest** underperformed (AUC **0.574**), reinforcing that algorithmic complexity alone does not universally guarantee improved predictive power in highly stochastic domains.
- **Primary Predictors:** The dominant signals were driven by environmental and exposure-related metrics, particularly temperature (`temp_c`), wind speed (`wind_kph`), traffic volume (`n_vehicles`, AADT, truck-share combinations), and distinct traffic-weather interaction features. Conversely, purely behavioral indicators carried significantly less weight in the final model than initially expected.
- **Understanding Predictive Power:** The moderate AUC (0.642) highlights a considerable natural overlap between severe and non-severe cases in real-world environments.

## Policy & Operational Implications
The intelligence produced by this system signals potential operational or governance gaps where condition-sensitive prioritization may currently be underutilized:
- **Corridor Prioritization:** Empowers municipalities and provincial authorities to dynamically rank corridor resource attention based on shifting conditions, rather than relying solely on retrospective, static hotspot analysis.
- **Resource Alignment:** Findings can direct targeted enforcement blitzes, responsive variable message signage activation, seasonal strategic planning, and roadway engineering reviews during vulnerable high-risk weather profiles.

## System Limitations
- **Conditional Severity:** The model predicts severity _conditional_ on a collision having already occurred; it evaluates consequence severity, not outright collision likelihood.
- **Data Approximations:** Environmental conditions are assigned by the nearest available weather station (missing potential microclimates), and exposure metrics are approximated at the broader route level.
- **Behavioral Signal:** The weak behavioral signal is likely symptomatic of underreporting or constrained data capture capabilities at the scene of the collision.
- **Predictive Ceiling:** The inherent randomness of vehicular collisions and human interplay imposes a firm ceiling on achievable predictive performance.

## Final Reflection
This system emphasizes a core truth in municipal analytics: better modeling does not remove foundational uncertainty. The intersection of human psychology, vehicle physics, and harsh environments ensures collision severity will retain a natural element of randomness. Therefore, the genuine value of this analytical tool is not found in seeking perfect prediction, but in supplying decision-makers with a precise, honest instrument to **elevate proactive risk prioritization**.
