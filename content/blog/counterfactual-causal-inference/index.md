+++
title = "The 8 Most Important Statistical Ideas: Counterfactual Causal Inference"
date = 2023-10-23
description = "Exploring beyond the mantra \"correlation doesn't imply causation\", this post introduces how counterfactuals serve as the cornerstone for determining cause-and-effect relationships."

[taxonomies]
tags = ["top 8 statistical ideas", "data science", "statistics", "paper review"]

[extra]
footnote_backlinks = true
social_media_card = "img/social_cards/blog_counterfactual_causal_inference.jpg"
+++

This article is the first in a [series of posts](/tags/top-8-statistical-ideas/) where I dive into the 8 most important statistical ideas of the past 50 years, as reviewed by [Gelman & Vehtari (2021)](https://arxiv.org/abs/2012.00174). I invite you to join me on this learning journey as we delve into the first concept: **counterfactual causal inference**.

<details>
  <summary>Introduction to the series: The 8 Most Important Statistical Ideas</summary>
  <p>The last 50 years have seen important advancements in the field of statistics, shaping the way we understand and analyse data. <a href="https://arxiv.org/abs/2012.00174">Gelman & Vehtari (2021)</a> reviewed the 8 most important statistical ideas of the past 50 years.</p>

  <p>As part of my learning journey, I decided to deepen my understanding of these 8 ideas and share my findings with you. In each article, you'll find an introduction to the concept at hand, along with some of the learning resources. So, if you're keen to deepen your grasp of statistics, you're in the right place!</p>
</details>

---

## Counterfactual Causal Inference

> "Correlation doesn't imply causation."

This truism begs the question: is there any way to identify causation?

> "causal identification is possible, under assumptions, and one can state these assumptions rigorously and address them, in various ways, through design and analysis."
>
> — Gelman & Vehtari (2021)

Different fields (econometrics, epidemiology, psychology…) have seen the appearance of various methods for **causal inference** —the process of determining the cause-and-effect relationship between variables—, with a common thread: the modelling of causal questions in terms of **counterfactuals**.

A counterfactual is something that didn't happen but *could have*. Here's an example of a counterfactual question: "What would your life be like if you had taken that job offer you declined?".

It's a counterfactual because it's inquiring about a potential outcome that did not occur. Indeed, another way of thinking about counterfactuals is to consider them **potential outcomes**.

The methods for causal inference aim to quantify these answers by using statistical methods, [causal models](https://en.wikipedia.org/wiki/Causal_model), and other techniques. Using causal inference, we can address questions such as:

- Does the early introduction of allergenic foods reduce the risk of developing allergies in children?
- What is the effect of drug decriminalisation on substance abuse rates?
- Should I get a pet?
- What if I had exercised regularly for the past six months?

Let's explore this last example.

Ideally, we would use a **Randomised Controlled Trial** (RCT) to answer this question. We would randomly assign people into two groups: one would exercise regularly for a month, and the other would not. Both would record their mood periodically.

Why can't we just look at people who exercise regularly and compare their mood to those who don't? **Confounding variables** is why.

A **confounder** is a variable that influences both the treatment and the outcome. For example, people who exercise regularly might have more free time. Wouldn't your mood improve with more free time? And wouldn't this extra time also make it easier for you to exercise regularly? You get the idea: the confounding variable (free time) can influence both the treatment (exercise) and the outcome (mood).

Thus, an RCT has two key advantages: it removes bias from confounding variables by isolating the effects of the treatment/intervention through randomisation, and it allows us to quantify the uncertainty in our estimates. The **counterfactual outcome** for each person who exercised is estimated to be the average mood of the group who did not exercise, and vice versa.

But RCTs are not always possible. Sometimes they're unethical[^1], or too expensive, or take too long. In these cases, we can use counterfactual causal inference to estimate the effect of an intervention. There are several methods for this, like [matching](https://en.wikipedia.org/wiki/Matching_(statistics)), [difference in differences](https://www.publichealth.columbia.edu/research/population-health-methods/difference-difference-estimation), or [instrumental variables estimation](https://en.wikipedia.org/wiki/Instrumental_variables_estimation).

In our example, we could use **matching** in lieu of an RCT. Namely, we would gather (observational) data from various individuals, and we would look for pairs of people who are similar in all aspects (e.g. age, diet, sleep patterns, amount of free time…) except for their exercise habits. These extra variables would help us control for confounders. With this data, we would compare the mood of these pairs to answer our question. Much simpler! Let's take a look:

{% wide_container() %}

| Subject    | Age | Diet Quality | Hours of Sleep | Free Time (hours) | Exercise (hours/week) | Mood Score |
|------------|-----|--------------|----------------|-------------------|----------------------|------------|
| Adam       | 25  | Good         | 8              | 2                 | 4                    | 8          |
| May        | 24  | Good         | 8              | 2.5               | 0                    | 6          |
| Anton      | 52  | Average      | 6.5            | 1                 | 4                    | 8          |
| Kashika    | 54  | Average      | 7              | 1                 | 0                    | 6          |
| Oluchi     | 35  | Poor         | 6              | 3                 | 4                    | 7          |
| Kílian     | 32  | Poor         | 6.5            | 3                 | 0                    | 5          |

{% end %}

Take the illustrative table above. We could match 3 pairs of subjects based on all variables except exercise. Can you see a pattern in terms of mood?

By comparing these matched pairs, we could estimate the causal effect of exercise on mood, answering our question through counterfactual causal inference. A (very specific and simplified) counterfactual answer would be "if May exercised 4 hours per week, her mood would be ~2 points higher".

## Bringing It All Together

In this article, we've explored the world of causal inference. While correlation can give us valuable clues, it's through causal inference that we come closer to understanding the "why" behind phenomena. Understanding causality is crucial for making informed decisions and implementing effective interventions in diverse fields.

We've seen how RCTs are the gold standard for causal inference, but that they're not always possible. In those cases, we can use counterfactual causal inference.

Counterfactual causal inference is used in healthcare (to estimate the effect of a treatment), education (to determine the efectiveness of a new curriculum), technology (to see how users react to a new feature), and many other fields.

{{ multilingual_quote(original="Felix qui potuit rerum cognoscere causas<br>
    Atque metus omnes, et inexorabile fatum<br>
    Subjecit pedibus, strepitumque Acherontis avari.", translated="He who’s been able to learn the causes of things is happy,<br>
    and has set all fear, and unrelenting fate, and the noise<br>
    of greedy Acheron, under his feet.", author="Virgil") }}

This quote from Virgil (29 BCE) reminds us that the quest to understand the "causes of things" is not just an academic exercise; it's an ancient human pursuit that can bring us closer to a harmonious understanding of our world and our place in it.

That's it for today! In the next article, we'll learn about **bootstrapping and simulation-based inference**.

## Learning Resources

**Fun project**: [Spurious correlations](https://tylervigen.com/spurious-correlations) is a project by Tyler Vigen that showcases strong (but spurious) correlations between seemingly unrelated variables like the number of people who drowned by falling into a pool and the number of films Nicolas Cage appeared in each year.

**Podcast**: [Alan Hájek on puzzles and paradoxes in probability and expected value — 80,000 Hours Podcast (2022)](https://80000hours.org/podcast/episodes/alan-hajek-probability-expected-value/#counterfactuals-021638). A deeply interesting discussion on probability, expected value, and counterfactuals. The discussion delves (starting in the 02:16:38 mark) into the nuances of counterfactual reasoning, and the need for precision in establishing logical rules for them. Hájek argues that most counterfactuals are essentially false but "approximately true and close enough to the truth that they convey useful information".

**Academic paper**: [Causal inference based on counterfactuals — Höfler (2005)](https://doi.org/10.1186/1471-2288-5-28). A quick overview on the counterfactual and related approaches. Reviews imperfect experiments, adjustment for confounding, time-varying exposures, competing risks and the probability of causation.

**Book**: [The Book of Why — Judea Pearl (2018)](http://bayes.cs.ucla.edu/WHY/). A deep dive into the science of causal inference and discovery, exploring theories, methods, and real-world applications. Pearl argues that all potential outcomes can be derived from Structural Equation Models, and lays out the problems with other approaches like matching.

---

[^1]: Sadly, there are far too many real examples of unethical research. See the [Tuskegee syphilis experiment](https://simple.wikipedia.org/wiki/Tuskegee_syphilis_experiment), the [Guatemala syphilis experiments](https://en.wikipedia.org/wiki/Guatemala_syphilis_experiments), or the [many examples of pharmaceutical companies failing to respect the core principles of ethical research in African countries](https://en.wikipedia.org/wiki/Medical_experimentation_in_Africa). Counterfactual causal inference methods can offer an alternative when conducting an RCT is ethically problematic.
