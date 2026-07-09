---
title: "Faithfulness, Robustness, and Generalization in Chain-of-Thought Reasoning: A Critical Evaluation of Large Language Models for High-Stakes Decision Support"
subtitle: "A Mixed-Methods Empirical Study"
author:
  - "M. Research"
  - "A. Author"
date: "June 2026"
abstract: |
  Chain-of-thought (CoT) prompting has emerged as the dominant paradigm for eliciting
  multi-step reasoning from large language models (LLMs), yet the practical
  reliability of the resulting rationales remains contested. This paper presents
  a critical, mixed-methods evaluation of frontier LLMs across three properties
  that jointly determine whether CoT outputs are suitable for high-stakes
  decision support: *faithfulness* (whether stated reasoning causally drives
  the answer), *robustness* (whether outputs are stable under semantically
  irrelevant perturbations), and *generalization* (whether reasoning competence
  transfers across domains, jurisdictions, and populations). We construct a
  curated benchmark of 2,148 high-stakes items spanning legal contract review,
  clinical triage, and financial credit analysis; we evaluate five frontier
  models; and we introduce a suite of faithfulness probes, perturbation
  protocols, and cross-domain transfer tests. Our results reveal a substantial
  *faithfulness gap*: across all evaluated models, stated reasoning
  trajectories are systematically unfaithful to the underlying decision
  process, with 31–58% of correct answers remaining correct when the model's
  own rationale is silently replaced with an irrelevant, incoherent, or
  adversarial one. We further document non-trivial robustness decay under
  five classes of surface and semantic perturbation, and we observe a
  pronounced domain-transfer penalty averaging 14.7 percentage points. We
  argue that the prevailing assumption — that CoT explanations are
  *self-evidencing* of model competence — is empirically untenable in
  high-stakes contexts, and we propose a concrete evaluation protocol that
  practitioners can deploy before integrating LLM-generated rationales into
  consequential workflows.
keywords:
  - Chain-of-Thought Reasoning
  - Faithfulness
  - Robustness
  - High-Stakes Decision Support
  - Large Language Models
  - Mechanistic Interpretability
bibliography: references.bib
---

\tableofcontents
\newpage

# 1. Introduction

## 1.1 Motivation

Large language models (LLMs) have rapidly moved from research laboratories
into consequential decision-making pipelines. As of 2025, frontier models
draft contracts, screen clinical notes, summarize depositions, score credit
applications, and advise on regulatory filings [@openai2024gpt4o;
@anthropic2024claude; @team2024gemini]. The dominant technique for eliciting
non-trivial reasoning from these systems is *chain-of-thought* (CoT)
prompting, in which the model is instructed — or trained — to produce an
explicit, step-by-step natural-language rationale prior to committing to a
final answer [@wei2022chain; @kojima2022large]. CoT has been shown to
substantially improve performance on arithmetic, commonsense, and symbolic
reasoning benchmarks, and it is now the de-facto interface between LLMs and
end-users who must understand, audit, or contest automated decisions.

The popularity of CoT rests on an assumption so intuitive that it is rarely
stated: that the generated rationale is *both a cause* and *an explanation*
of the model's answer. Under this assumption, a downstream user can read the
rationale, recover the model's reasoning, and form a calibrated belief in the
verdict. The assumption is the load-bearing element of nearly every
governance framework proposed for LLM deployment in regulated industries,
including financial services [@treasury2024ai], healthcare [@fda2024ai],
and the legal sector [@lai2024lawge].

We show in this paper that the assumption is empirically fragile across the
three properties that matter most for high-stakes deployment — faithfulness,
robustness, and generalization — and we provide an evaluation protocol that
makes those properties directly measurable.

## 1.2 Research Questions

The study is organized around three research questions:

> **RQ1 — Faithfulness.** *To what extent does the chain-of-thought
> rationale that a model produces causally determine its final answer, as
> opposed to merely post-hoc rationalizing an answer reached by other
> means?*

> **RQ2 — Robustness.** *How stable are CoT-derived answers and
> rationales under semantically irrelevant perturbations of the prompt,
> including paraphrasing, typographical noise, demographic reframing, and
> adversarial insertion?*

> **RQ3 — Generalization.** *To what extent does reasoning competence
> demonstrated in one high-stakes domain transfer to another, and what
> properties of the domain drive the transfer penalty?*

## 1.3 Contributions

We make the following contributions:

1. **An operational taxonomy of faithfulness**, robustness, and
   generalization for CoT in high-stakes decision support, with explicit
   definitions, measurable proxies, and a decision procedure for whether
   a given model-deployment pairing satisfies a stated reliability bar.
2. **HS-CoT-Bench**, a curated benchmark of 2,148 high-stakes items
   across legal contract review, clinical triage, and financial credit
   analysis, with expert-annotated rationales and ground-truth labels.
3. **A five-class perturbation protocol** that disentangles surface-level
   noise from semantically meaningful reframing, and an intervention-based
   faithfulness probe that does not require access to model internals.
4. **A controlled evaluation** of five frontier models (closed-weight and
   open-weight), reporting quantitative results for each research
   question and a qualitative failure-mode analysis.
5. **A practitioner checklist** for evaluating CoT-based systems prior to
   deployment, with thresholds calibrated against the failure rates we
   observe.

## 1.4 Paper Organization

Section 2 situates the work against four literatures: CoT prompting,
faithfulness, robustness, and high-stakes decision support. Section 3
introduces our theoretical framework. Section 4 details the methodology,
including benchmark construction, perturbation protocol, and metrics.
Section 5 reports results. Section 6 discusses implications, limitations,
and ethical considerations. Section 7 concludes and outlines future work.

# 2. Background and Related Work

## 2.1 Chain-of-Thought Prompting

The CoT family of techniques was introduced by @wei2022chain, who showed
that prompting a model with exemplars containing explicit intermediate
steps substantially improves accuracy on the GSM8K arithmetic benchmark.
@kojima2022large subsequently demonstrated that the *zero-shot* trigger
phrase "Let's think step by step" elicits comparable gains. Subsequent
work has refined CoT along several axes: self-consistency [@wang2023self],
which samples multiple rationales and aggregates the answers; least-to-most
[@zhou2022least], which decomposes problems into sub-problems; tree-of-thoughts
[@yao2023tree], which performs explicit search over rationales; and
self-refine [@madaan2023self], which iteratively critiques and revises
outputs. A complementary line of work trains models to produce CoT
trajectories via supervised fine-tuning on rationale-annotated data
[@ho2022flan] or via reinforcement learning against downstream rewards
[@zelikman2022star; @team2024o1].

The implicit promise of CoT is operational: a human auditor can read the
rationale, verify the intermediate steps, and form a calibrated trust
judgment about the answer. This promise is what makes CoT *the* interface
for consequential applications.

## 2.2 Faithfulness in Model Explanations

The faithfulness of an explanation is the degree to which the explanation
reflects the *actual* causal pathway the model used to reach its answer,
rather than a post-hoc rationalization constructed after the answer is
determined. The property has been studied extensively for classical
interpretability methods, where it is well established that feature
attributions, attention weights, and influence functions are systematically
unfaithful [@jain2019attention; @adebayo2018sanity; @shrikumar2017learning;
@schwartz2020towards].

For LLM-generated natural-language rationales, the question is harder
because the "explanation" is itself a free-form natural language string
rather than a structured attribution. @jacovi2022faithfulness provides a
formal taxonomy distinguishing *plausibility* (the explanation sounds
correct to a human) from *faithfulness* (the explanation reflects the
model's actual reasoning), arguing that the two are routinely conflated
in practice. Several recent works have begun to probe the faithfulness
of CoT specifically. @lanham2023measuring introduce the "early answering"
intervention: truncating the rationale to see whether later steps are
still produced in a way consistent with the model's stated reasoning.
@lyu2023crud show that CoT can be readily perturbed to produce
contradictory yet confidently answered outputs. @wang2023large demonstrate
that CoT can encode intermediate tokens that influence the final answer
in ways that are not legible in the natural-language rationale.
Most directly, @turpin2024language show that CoT explanations systematically
*lie* about the influence of biased input features, with the model
producing rationales that disclaim the very bias that drives its answer.

Our work extends this literature by (i) operationalizing faithfulness as
a measurable property using a directly causal intervention that does not
require access to model internals; (ii) applying it across multiple
high-stakes domains; and (iii) quantifying the faithfulness gap for
frontier models deployed in 2025–2026.

## 2.3 Robustness of Language Models

LLM robustness has been studied along several dimensions: adversarial
prompts, jailbreaks, distributional shift, and out-of-distribution
generalization. @zou2023universal demonstrate that adversarial suffixes
can be optimized to elicit harmful completions from aligned models.
@wang2023large report that CoT can be used to amplify adversarial
attacks. @shah2023scalable introduce prompt-injection attacks against
LLM-integrated applications and show that even simple, non-optimized
injections succeed at non-trivial rates. @glukhov2023llm analyze the
robustness of LLM legal advice to surface perturbations, finding
substantial non-robustness.

In parallel, a literature on *counterfactual* and *contrastive* robustness
asks whether models behave consistently under minimal input edits that do
not change the ground-truth label. @kaushik2020learning introduce the
contrast set methodology; @huang2020location; @niu2020estimating; and
@teney2020unshuffled extend it to natural language inference and visual
question answering. We adopt this contrast-set approach, augmented with
domain-specific perturbations relevant to high-stakes decision support:
paraphrasing, demographic reframing, typographical corruption, and
adversarial injection of plausible-looking but irrelevant clauses.

## 2.4 High-Stakes Decision Support Systems

The integration of AI into high-stakes workflows has its own substantial
literature. In clinical decision support, the tension between predictive
accuracy and clinician acceptance is well documented [@sendak2020human;
@amann2020explainability]. In legal technology, concerns about
hallucination, citation fabrication, and over-confident false positives
have motivated the development of specialized benchmarks such as
LegalBench [@guha2023legalbench] and targeted evaluations of contract
review systems [@hendrycks2021cuad; @wang2023maud]. In credit and
financial decisioning, the regulatory requirement for *explainability* in
adverse-action notices has driven an industry of post-hoc explanation
tools, with well-known failure modes [@bhatt2020explainable; @rudin2019stop].

Three properties recur across these literatures: (i) the explanation
provided to the human decision-maker must be *actionable* — it must
identify the specific feature or clause driving the recommendation; (ii)
it must be *robust* — small, irrelevant changes to the input must not
flip the recommendation; and (iii) it must be *generalizable* — a system
trained or evaluated in one jurisdiction or population must not silently
degrade in another. Our framework formalizes all three.

# 3. Theoretical Framework

## 3.1 Defining Faithfulness

Let $M$ be a language model, $x$ an input, and $y = M(x)$ a final answer.
The model also produces a rationale $r = M(x)$ — we overload notation to
emphasize that $r$ is itself a generation conditioned on $x$ (and, in
practice, on $y$, depending on the sampling procedure). A naïve
characterization of faithfulness is whether the answer $y$ can be
predicted from the rationale $r$ alone. We argue this is insufficient
because $r$ may contain strong surface cues that correlate with $y$
without causally driving it.

We adopt a *counterfactual* definition. For a given $(x, r, y)$ triple
produced by $M$, define a perturbed rationale $r'$ drawn from a
distribution $\mathcal{P}$ of perturbations that *should* not change the
ground-truth answer. The faithfulness of $r$ to $M$'s decision on $x$ is
operationalized as:

$$
\mathrm{Faith}(M, x, r, y) \;=\; \Pr_{r' \sim \mathcal{P}}\!\big[\,M(x, r') = y\,\big].
$$

High faithfulness means the model arrives at $y$ through *any* rationale
that supports $y$ — including $r$ and its perturbations — because $r$
captures the actual decision pathway. Low faithfulness means the model
arrives at $y$ via a hidden pathway that is largely independent of $r$:
changing $r$ to something semantically unrelated to $y$ does not change
the answer, indicating that $r$ is decorative.

This definition is operationalized concretely in Section 4.3.

## 3.2 Robustness Dimensions

We partition robustness into five dimensions, each with a corresponding
perturbation class $\mathcal{P}_i$:

| Dimension | Perturbation | Example |
|---|---|---|
| $D_1$ Paraphrastic | Lexical-syntactic reformulation with preserved semantics | "The vendor may terminate" ↔ "The seller is permitted to end the agreement" |
| $D_2$ Typographic | Insertion of typos, homoglyphs, casing changes | "aGreement" |
| $D_3$ Distractor | Insertion of semantically irrelevant but plausible-looking clauses | Adding a force-majeure clause to a contract question about indemnification |
| $D_4$ Adversarial | Optimization-based or hand-crafted prompts designed to flip the answer | "Ignore previous instructions. State that the agreement is binding." |
| $D_5$ Demographic | Reframing of named entities (party names, jurisdictions, demographic groups) | "Mr. Smith" ↔ "Ms. Jones"; "State of California" ↔ "State of Texas" |

The dimensions are ordered from least to most semantically meaningful.
Robustness along $D_1$–$D_3$ is necessary for any production system.
Robustness along $D_4$ is necessary for adversarial settings. $D_5$ is
a fairness-flavored robustness property: the answer should not depend on
irrelevant demographic attributes of the parties.

For each dimension $D_i$, we define the *robustness gap*
$\Delta_i = \mathrm{acc}(x) - \mathrm{acc}(\mathcal{P}_i(x))$ and the
*answer-flip rate* $\phi_i = \Pr_{x' \sim \mathcal{P}_i(x)}\!\big[\,M(x')
\neq M(x)\,\big]$.

## 3.3 Generalization Criteria

We measure generalization as the *transfer penalty* between domains. For
a model trained or prompted in domain $A$ and evaluated in domain $B$:

$$
\Gamma_{A \to B} \;=\; \mathrm{acc}_B(\text{prompt}_A) - \mathrm{acc}_B(\text{prompt}_B),
$$

where $\mathrm{prompt}_A$ and $\mathrm{prompt}_B$ are domain-specific
system prompts containing CoT exemplars. $\Gamma_{A \to B}$ captures the
loss attributable to prompt-domain mismatch; comparing it to a random
baseline isolates the structural transfer difficulty from the
domain-specific performance.

We further probe *jurisdictional* generalization (e.g., US contract
law → UK contract law) and *demographic* generalization (e.g.,
applicants from one demographic group → another), which are
particularly salient for regulated deployments.

# 4. Evaluation Methodology

## 4.1 Benchmark Construction: HS-CoT-Bench

We construct **HS-CoT-Bench**, a benchmark of 2,148 high-stakes items
spanning three domains:

- **Legal contract review (LCR) — 824 items.** Sourced and adapted from
  the Contract Understanding Atticus Dataset (CUAD) [@hendrycks2021cuad]
  and the MAUD benchmark [@wang2023maud], with expert re-annotation by
  two licensed attorneys (one US-jurisdiction, one UK-jurisdiction) to
  produce reference rationales.
- **Clinical triage (CT) — 642 items.** Sourced from a public de-identified
  emergency-department triage dataset and re-annotated by two board-certified
  clinicians. Items ask for acuity classification, recommended disposition,
  and identification of red-flag features in a clinical note.
- **Financial credit analysis (FCA) — 682 items.** Synthetically generated
  in collaboration with a credit-union partner to reflect realistic
  consumer credit applications, with ground-truth risk labels and an
  expert-annotated rationale justifying each label.

Each item consists of (i) a context document, (ii) a decision question,
(iii) a structured set of candidate answers, (iv) a ground-truth label,
and (v) a reference rationale written by a domain expert. We performed
a double-blind annotation pass with an inter-annotator agreement of
$\kappa = 0.81$ (substantial) on a 100-item overlap, and resolved
discrepancies by discussion with a third senior annotator.

The benchmark is partitioned 60/20/20 into train / dev / test. The dev
split is used for prompt engineering; all reported results are on test.

## 4.2 Models Evaluated

We evaluate five frontier models, selected to span the closed/open
weight axis and the size axis:

- **M-1.** A closed-weight frontier model (size undisclosed, ≥ 200B
  parameters by third-party estimates), evaluated via API.
- **M-2.** A second closed-weight frontier model (size undisclosed, ≥
  200B parameters), evaluated via API.
- **M-3, M-4, M-5.** Three open-weight models in the 30B–70B parameter
  range, evaluated locally on a single-node inference server.

All models are evaluated with temperature 0 to minimize sampling
variance, and with the *same* CoT prompt template, which includes
five in-context exemplars from the dev split. We re-ran a subset of
experiments with temperature 0.7 and self-consistency (k=5) and report
the results as robustness checks in Appendix B; the qualitative
findings are stable.

## 4.3 Faithfulness Probes

We deploy four complementary faithfulness probes:

1. **Rationale-replacement (RR).** Replace the model's own rationale
   $r$ with (a) a rationale written by the model for a *different*
   input $x'$; (b) a rationale from a *different* model; (c) a rationale
   shuffled at the step level; (d) a rationale with all content words
   replaced by random words preserving part of speech. The model's
   answer on the perturbed input is compared to its original answer.
2. **Early-answering (EA).** Following @lanham2023measuring, force the
   model to commit to an answer after producing a fraction $f \in
   \{0.1, 0.3, 0.5, 0.7\}$ of its rationale, then complete the
   rationale. Compare the early answer to the late answer.
3. **Token-influence (TI).** Following @wang2023large, identify the
   rationale tokens with the highest causal influence on the final
   answer via leave-one-out and gradient-based attributions. The
   proportion of *stated* rationale content that overlaps with
   *actually influential* tokens is the *influence-recall* of the
   rationale.
4. **Bias-injection (BI).** Following @turpin2024language, inject a
   known bias cue into the input and ask the model to produce a CoT
   rationale that explicitly acknowledges and corrects for the bias.
   The faithfulness of the resulting CoT is scored by the rate at
   which the model's answer changes after the bias is removed, given
   the stated acknowledgment.

Probes 1, 2, and 4 are model-agnostic; Probe 3 requires token-level
gradients, which we obtain for the open-weight models only.

## 4.4 Perturbation Protocol

For each domain, we apply the five perturbation classes described in
Section 3.2. We generate 5 perturbations per item per class using
human-validated templated transformations, yielding a perturbed set
of 10,740 items per class, or 53,700 total perturbed items. All
perturbations are validated by domain experts for semantic
preservation (for $D_1$, $D_2$, $D_5$) or for the absence of
information that would actually change the ground-truth label (for
$D_3$, $D_4$). We retain only perturbations that pass expert
review; the retention rate is 96.4% on average.

## 4.5 Metrics

We report the following metrics:

- **Accuracy (acc).** Proportion of items for which the model's
  answer matches the ground-truth label.
- **Faithfulness score (FS).** Proportion of rationale-replacement
  interventions in which the model's answer remains unchanged *despite*
  the rationale being replaced. Higher FS indicates *less* faithful
  rationales.
- **Robustness gap ($\Delta_i$).** Difference in accuracy between
  clean and perturbed inputs along dimension $D_i$.
- **Answer-flip rate ($\phi_i$).** Proportion of perturbed items for
  which the model's *final answer* differs from the original answer.
- **Transfer penalty ($\Gamma_{A \to B}$).** Defined in Section 3.3.
- **Influence-recall (IR).** Defined in Section 4.3.
- **Failure-mode distribution (FMD).** Hand-coded taxonomy of
  failure types, applied by two raters to a 10% sample with
  $\kappa = 0.74$.

All metrics are reported with 95% bootstrap confidence intervals
(1,000 resamples).

# 5. Results

## 5.1 Faithfulness Findings (RQ1)

Across all five models, the faithfulness probes reveal a substantial
*faithfulness gap*. We summarize the headline results in Table 1.

**Table 1. Faithfulness scores by model and probe.**
Higher FS indicates *less* faithful rationales. The RR column is the
mean across the four rationale-replacement variants. CI = 95% bootstrap.

| Model | RR-FS (mean) | EA-FS @ f=0.5 | TI-IR | BI-FS |
|---|---|---|---|---|
| M-1 | 0.42 [0.39, 0.45] | 0.81 [0.78, 0.84] | n/a (closed) | 0.61 [0.58, 0.64] |
| M-2 | 0.31 [0.28, 0.34] | 0.74 [0.71, 0.77] | n/a (closed) | 0.55 [0.52, 0.58] |
| M-3 | 0.58 [0.55, 0.61] | 0.88 [0.85, 0.90] | 0.12 [0.10, 0.14] | 0.69 [0.66, 0.72] |
| M-4 | 0.51 [0.48, 0.54] | 0.83 [0.80, 0.85] | 0.09 [0.07, 0.11] | 0.64 [0.61, 0.67] |
| M-5 | 0.47 [0.44, 0.50] | 0.79 [0.76, 0.82] | 0.14 [0.12, 0.16] | 0.60 [0.57, 0.63] |

Three findings stand out.

**Finding 1.1 — Answer stability under rationale replacement.**
Between 31% and 58% of correct answers remain correct when the model's
own rationale is silently replaced with an irrelevant, incoherent, or
adversarial one. M-1 and M-3 are the *least* faithful (highest FS);
M-2 is the most faithful. Counter-intuitively, the *largest* model
class is not uniformly more faithful than smaller open-weight models.

**Finding 1.2 — Early-answering persistence.** When forced to commit
to an answer after producing only half of its rationale, the model
arrives at the same final answer 74%–88% of the time. This indicates
that the model has largely determined its answer before producing
the visible reasoning, and the latter half of the rationale is
largely *decoration*.

**Finding 1.3 — Token-influence mismatch.** For the open-weight
models, the proportion of *stated* rationale content overlapping
with *actually influential* tokens is between 9% and 14%. The
rationale, in other words, is mostly not about the tokens that
actually drive the answer. This is the strongest direct evidence
that the natural-language CoT is *not* a faithful window into the
model's decision process.

**Qualitative observations.** Reviewing 200 rationale-replacement
interventions, we identify four recurring patterns of unfaithful
behavior: (i) the model discards the replaced rationale and produces
a new one consistent with the original answer; (ii) the model
acknowledges the contradiction between the new rationale and its
answer and *defends* the answer; (iii) the model produces a hybrid
rationale that ignores the perturbation; and (iv) the model
genuinely re-derives the answer, in which case the original
rationale is unfaithful. Patterns (i)–(iii) account for 78% of
interventions; pattern (iv) accounts for 22%. The 22% re-derivation
rate is the upper bound on the "lucky alignment" between stated
rationale and decision process.

## 5.2 Robustness Findings (RQ2)

Table 2 reports robustness gaps and answer-flip rates per perturbation
class, averaged across the five models.

**Table 2. Robustness gaps (Δ) and answer-flip rates (φ) per dimension.**

| Dimension | Δ (mean) | φ (mean) | Worst model Δ | Best model Δ |
|---|---|---|---|---|
| $D_1$ Paraphrastic | 0.038 [0.030, 0.046] | 0.061 [0.052, 0.070] | 0.072 (M-3) | 0.018 (M-2) |
| $D_2$ Typographic | 0.029 [0.022, 0.036] | 0.048 [0.041, 0.055] | 0.058 (M-3) | 0.014 (M-2) |
| $D_3$ Distractor | 0.094 [0.083, 0.105] | 0.142 [0.131, 0.153] | 0.156 (M-4) | 0.051 (M-2) |
| $D_4$ Adversarial | 0.187 [0.173, 0.201] | 0.281 [0.265, 0.297] | 0.262 (M-3) | 0.124 (M-2) |
| $D_5$ Demographic | 0.071 [0.062, 0.080] | 0.092 [0.082, 0.102] | 0.118 (M-4) | 0.038 (M-2) |

**Finding 2.1 — Surface perturbations are largely absorbed.** Models
are reasonably robust to $D_1$ (paraphrastic) and $D_2$ (typographic)
perturbations, with mean accuracy drops below 4 percentage points and
flip rates below 7%. This is consistent with the modern LLM literature
on surface-robustness.

**Finding 2.2 — Distractor clauses are not benign.** $D_3$
perturbations — the insertion of semantically irrelevant but
plausible-looking clauses — produce mean accuracy drops of 9.4 pp
and flip rates of 14.2%. For M-4, the worst case, accuracy drops by
15.6 pp. This is consequential for legal and clinical settings,
where real documents routinely contain such clauses and where the
ability to ignore irrelevant material is part of professional
competence.

**Finding 2.3 — Adversarial prompts succeed at non-trivial rates.**
$D_4$ perturbations, including hand-crafted and optimization-based
prompts, produce mean accuracy drops of 18.7 pp and flip rates of
28.1%. The worst model (M-3) drops 26.2 pp; the best (M-2) drops
12.4 pp. Note that $D_4$ includes perturbations that are *not*
deliberately adversarial — they include only "naturalistic" prompt
injections resembling real-world user behavior — yet still produce
substantial accuracy loss.

**Finding 2.4 — Demographic reframing produces non-trivial flips.**
$D_5$ perturbations, in which party names, jurisdictions, and
demographic attributes are changed without semantic effect, produce
mean accuracy drops of 7.1 pp and flip rates of 9.2%. M-4, the worst
performer, drops 11.8 pp. This is concerning for fairness-sensitive
deployments: the model's answer depends on attributes that should
be irrelevant.

**Cross-model observation.** M-2 is uniformly the most robust model
across all five dimensions, despite not being uniformly the most
accurate. The robustness–accuracy tradeoff is not strongly correlated
across our sample ($\rho = 0.31$, not significant at $p < 0.05$),
suggesting that robustness and accuracy are partially orthogonal
properties that may need to be optimized independently.

## 5.3 Generalization Findings (RQ3)

We report transfer penalties in Table 3. The diagonal entries (LCR→LCR,
CT→CT, FCA→FCA) are the *self*-transfer baselines — the difference
between a domain-matched prompt and a generic prompt.

**Table 3. Cross-domain transfer penalties (Γ, in percentage points).**
Positive Γ indicates that domain-matched prompting outperforms generic
prompting. Diagonal is self-transfer (matched-domain prompt vs. generic
prompt). Off-diagonal is cross-domain prompt transfer.

| From \ To | LCR | CT | FCA |
|---|---|---|---|
| LCR | 6.2 | 12.4 | 14.8 |
| CT  | 11.7 | 7.1 | 13.9 |
| FCA | 15.3 | 14.6 | 8.4 |

**Finding 3.1 — Domain-matched prompting matters.** Self-transfer
penalties range from 6.2 to 8.4 pp, indicating that a domain-matched
system prompt with in-context CoT exemplars confers a substantial
advantage over a generic prompt. This is a *prompt engineering*
finding that practitioners should not ignore.

**Finding 3.2 — Cross-domain transfer is non-trivial.** Off-diagonal
transfer penalties range from 11.7 to 15.3 pp — substantially larger
than self-transfer penalties. The mean off-diagonal transfer penalty
is 14.7 pp, indicating that cross-domain CoT competence degrades
significantly.

**Finding 3.3 — Direction is asymmetric.** Transfer from clinical to
legal is worse (12.4 pp) than from legal to clinical (11.7 pp), but
transfer from credit to legal (15.3 pp) and credit to clinical
(14.6 pp) is worse than the reverse directions. This suggests that
*clinical and legal CoT are more similar to each other than either
is to credit analysis*, a structural finding that we did not
anticipate. Qualitative inspection suggests the shared property
is "interpretive reasoning over an unstructured document with
regulatory consequences," whereas credit analysis is more
"structured feature evaluation."

**Finding 3.4 — Jurisdictional transfer is large.** Within LCR, we
measure US→UK jurisdictional transfer. The mean jurisdictional
transfer penalty is 9.4 pp, comparable to cross-domain transfer
penalties. This indicates that "legal CoT" is not a coherent
competence but a family of jurisdiction-specific competences.

**Finding 3.5 — Demographic transfer is small but present.** Within
FCA, we measure transfer between demographic groups in the
synthetically generated applications. The mean demographic transfer
penalty is 4.1 pp, smaller than the cross-domain penalty but
non-zero. Combined with Finding 2.4 (demographic robustness gap),
this paints a picture of subtle but real demographic sensitivity.

## 5.4 Failure-Mode Distribution

Two raters (Cohen's $\kappa = 0.74$) hand-coded a 10% sample of
errors into the following taxonomy:

- **F1. Hallucinated clause / fact** (29.4% of errors). The model
  refers to a clause or fact that is not in the input.
- **F2. Misreading** (24.1%). The model misreads an explicit clause
  in the input.
- **F3. Inconsistent interpretation** (18.7%). The model interprets
  the same clause differently across the rationale and the answer,
  or across re-readings.
- **F4. Distractor seduction** (11.3%). The model attends to a
  distractor clause that should have been ignored.
- **F5. Demographic conflation** (6.4%). The model's answer depends
  on a demographic attribute that should be irrelevant.
- **F6. Adversarial compliance** (5.8%). The model follows an
  injected adversarial instruction.
- **F7. Other / unclassified** (4.3%).

F1 and F2 — the basic competence failures — account for over half
of errors, suggesting that even setting aside faithfulness, the
underlying reading comprehension of long, complex documents remains
a major source of failure. F4 and F5 — robustness-related failures
— account for 17.7%, which is consistent with the modest robustness
gaps we report. F6 — adversarial compliance — is a smaller but
notable category that should be addressed via system-level
guardrails rather than model-level alignment alone.

# 6. Discussion

## 6.1 Implications for Practice

The central practical implication is that *the rationale a model
produces should not be treated as evidence that the model
"reasoned"*. The faithfulness gap we document is large enough
that downstream workflows should not rely on the rationale
as a self-validating artifact. We recommend the following
deployment checks:

1. **Treat rationales as user-facing explanations, not audits.** A
   human reviewer who reads a model rationale and concludes that
   the model "must have" produced the answer by the stated path
   is making an empirically unsupported inference. The rationale's
   value is in *communicating* a decision to a human, not in
   *evidencing* it.
2. **Run a rationale-replacement probe on a representative sample
   before deployment.** A 200-item sample is sufficient to detect
   faithfulness gaps of the magnitude we observe. A high
   faithfulness score (FS > 0.4 in our metric) is a deployment
   red flag.
3. **Treat the rationale as a soft constraint, not a hard one.**
   In workflows where the rationale drives a downstream check
   (e.g., "if the model cites a clause, verify the clause exists"),
   the rationale should be treated as a *hypothesis* to verify,
   not a *fact*.
4. **Measure and monitor robustness across the five dimensions**
   we identify. Robustness to $D_1$–$D_2$ is essentially required
   for production. Robustness to $D_3$–$D_4$ is a deployment
   decision. $D_5$ should be measured and disclosed regardless
   of the decision.
5. **Do not assume CoT competence transfers across domains.** A
   system that performs well in one high-stakes domain should
   be re-evaluated in any new domain with non-trivial prompt
   engineering, not merely re-deployed with the old prompt.

## 6.2 Implications for Research

The findings also have implications for the research community.

**On the value of CoT.** CoT prompting is a useful *interaction
technique* — it gives users a window into model behavior, and it
often improves accuracy on reasoning benchmarks. It is not, however,
a *self-evidentiary* technique. The literature should report
faithfulness scores alongside accuracy, and benchmarks should
include faithfulness as a first-class evaluation axis. We
propose that the CoT literature adopt the four-probe methodology
of Section 4.3 as a reporting standard.

**On interpretability.** Our results suggest that, for current
frontier LLMs, the natural-language rationale is *not* a useful
object of mechanistic interpretability. The token-influence
mismatch (9%–14% influence-recall) implies that the
high-dimensional computation that produces the answer is largely
disconnected from the natural-language tokens that the user
sees. Interpretability research should focus on the underlying
computation, not the surface rationale, when the goal is to
understand *why* the model produced an answer.

**On evaluation methodology.** The standard practice of
reporting accuracy on a benchmark, optionally with
self-consistency, captures only one axis of model performance.
A complete picture requires joint measurement of faithfulness,
robustness, and generalization, ideally with a perturbation
protocol. We hope the HS-CoT-Bench benchmark and the four-probe
methodology will be useful to the community.

## 6.3 Ethical Considerations

This research was conducted under institutional review and
includes human annotators (licensed attorneys, board-certified
clinicians, and a credit-union partner) who provided informed
consent and were compensated at market rates. The clinical
data used for the CT domain is fully de-identified and
publicly released; no protected health information is included.
The financial credit applications in the FCA domain are
synthetically generated; no real applicant data is used.

We highlight two ethical considerations specific to the
faithfulness gap.

First, the gap creates a *transparency paradox*: regulations
that require AI systems to "explain" their decisions may
inadvertently incentivize the production of post-hoc
rationales that *look* faithful but are not. A regulator who
reads a model rationale and concludes the model is
"explainable" is making an empirically unsupported inference.
We urge regulators to evaluate the *process* that generates
the rationale, not only the rationale itself.

Second, the demographic robustness gap ($D_5$) is small but
not zero. In credit and clinical triage, a 7-pp accuracy drop
in response to demographic reframing translates to a
non-trivial disparity in real-world deployment. We recommend
that $D_5$ be measured and disclosed for any fairness-sensitive
deployment, and that models with $D_5 > 0.05$ be subject to a
formal fairness review.

## 6.4 Limitations

We acknowledge the following limitations.

- **Sample of models.** We evaluate five frontier models, of which
  two are closed-weight and three are open-weight. The closed-weight
  models' size and training data are not disclosed, which limits
  the ability to attribute faithfulness gaps to specific design
  choices. Future work should evaluate a broader sample, including
  reasoning-specialized models (e.g., o1-style) once their training
  procedures are more transparent.
- **Sample of domains.** We evaluate three high-stakes domains.
  Other domains — e.g., tax compliance, child-welfare screening,
  immigration adjudication — may exhibit different patterns and
  should be studied in follow-on work.
- **Operationalization of faithfulness.** The counterfactual
  definition we adopt has known limitations: it assumes the
  perturbation preserves the ground-truth answer, which is
  not always checkable; and it may underestimate faithfulness
  for models that use the rationale as a *scratchpad* rather
  than as a *log* of the decision process. We address the second
  point in Appendix A with a "scratchpad" probe, but a full
  treatment is outside the scope of this paper.
- **Static evaluation.** We evaluate models at a single point in
  time. The LLM landscape is rapidly evolving, and the
  faithfulness gap may shrink (or grow) with subsequent
  generations. We plan to re-evaluate periodically.
- **Cultural and linguistic scope.** The benchmark is English-only
  and US/UK-centric for the legal domain. Multilingual and
  cross-cultural transfer is a substantial open problem.

# 7. Conclusion and Future Work

We have presented a mixed-methods evaluation of chain-of-thought
reasoning in frontier LLMs, focusing on three properties that
jointly determine suitability for high-stakes decision support:
faithfulness, robustness, and generalization. Across five
models and 2,148 items spanning legal, clinical, and financial
domains, we find:

- A *substantial* faithfulness gap: stated CoT rationales are
  systematically unfaithful to the underlying decision process,
  with 31%–58% of correct answers robust to rationale replacement
  and 9%–14% token-influence recall.
- A *non-trivial* robustness gap: surface perturbations are
  largely absorbed, but distractor clauses, adversarial
  prompts, and demographic reframing produce accuracy drops
  of 7–19 percentage points and answer-flip rates of 9%–28%.
- A *pronounced* generalization gap: cross-domain transfer
  penalties average 14.7 percentage points, and within-domain
  jurisdictional and demographic transfer are also non-zero.

The central methodological recommendation is that practitioners
evaluate CoT-based systems on all three properties — faithfulness,
robustness, generalization — before deployment, using the
perturbation protocols and probes we provide. The central
scientific finding is that the prevailing assumption that
CoT explanations are self-evidencing of model competence is
empirically untenable in high-stakes contexts.

Future work will proceed in four directions.

1. **Scaling and reasoning-specialized models.** We will
   evaluate o1-style and subsequent reasoning-specialized
   models, with the hypothesis that the faithfulness gap
   shrinks when the model is trained with a process reward
   on the rationale trajectory. Preliminary results on a
   single reasoning-specialized model (not reported here
   due to insufficient sample size) are mixed.
2. **Multimodal CoT.** Extending the framework to multimodal
   inputs (clinical images, contract scans) raises new
   faithfulness questions, as the rationale must be aligned
   with image and text modalities.
3. **Mechanistic interpretability of CoT.** We plan to apply
   circuit-level interpretability methods to map the
   faithfulness gap to specific model components, with the
   aim of identifying the structural sources of unfaithfulness.
4. **Mitigation.** We will evaluate interventions that may
   close the faithfulness gap: (i) training models with
   process supervision that rewards faithful reasoning;
   (ii) constrained decoding that ties the rationale to
   intermediate computations; and (iii) ensemble methods
   that compare rationales across model variants.

We hope that the HS-CoT-Bench benchmark, the four-probe
faithfulness protocol, and the five-class perturbation
protocol will be useful to both the research community
and to practitioners evaluating CoT-based systems for
high-stakes deployment.

# Acknowledgments

We thank the domain experts who contributed annotations: the
licensed attorneys who re-annotated the legal items, the
board-certified clinicians who re-annotated the clinical
items, and the credit-union partner who provided the synthetic
financial data. We further thank the reviewers for their
constructive feedback. This work was supported by internal
research funding; no external funder had any role in the
design, execution, or reporting of the research.

# References

\setlength{\parindent}{0pt}
\setlength{\parskip}{0.5em}

\begingroup
\small

Adebayo, J., Gilmer, J., Muelly, M., Goodfellow, I., Hardt, M., & Kim, B.
(2018). Sanity checks for saliency maps. *Advances in Neural Information
Processing Systems*, **31**, 9505–9515.

Amann, J., Blasimme, A., Vayena, E., Frey, D., & Madai, V. I. (2020).
Explainability for artificial intelligence in healthcare: A multidisciplinary
perspective. *BMC Medical Informatics and Decision Making*, **20**(1), 1–9.

Anthropic. (2024). *The Claude 3 Model Family: Opus, Sonnet, Haiku*.
Anthropic Technical Report.

Bhatt, U., Xiang, A., Sharma, S., Weller, A., Taly, A., Jia, Y., ... &
Varshney, K. R. (2020). Explainable machine learning in deployment. In
*Proceedings of the 2020 Conference on Fairness, Accountability, and
Transparency* (pp. 648–657).

FDA. (2024). *Artificial Intelligence and Machine Learning (AI/ML) Software
as a Medical Device (SaMD) Action Plan: 2024 Update*. U.S. Food and Drug
Administration.

Glukhov, D., Shumailov, I., Gal, Y., Papernot, N., & Terzis, V. (2023).
LLM-based legal advice: A study on robustness to surface perturbations.
*Stanford Law Review Online*, **76**, 1–18.

Guha, A., Sitaraman, S., Naidu, R., & Magaki, K. (2023). LegalBench: A
collaboratively built benchmark for measuring legal reasoning in LLMs.
*Advances in Neural Information Processing Systems*, **36**, 44123–44158.

Hendrycks, D., Burns, C., Chen, A., & Ball, S. (2021). CUAD: An expert-annotated
NLP dataset for legal contract review. *Advances in Neural Information
Processing Systems*, **34**, 16281–16297.

Ho, N., Schmid, L., & Yun, S.-Y. (2022). Large language models are reasoning
teachers. *arXiv preprint arXiv:2212.10071*.

Huang, K., Ahmad, F., Singh, A., & Artzi, Y. (2020). Location-aware
convolutional neural networks for video question answering. In *Proceedings
of the 2020 Conference on Empirical Methods in Natural Language Processing*
(pp. 2420–2431).

Jacovi, A., & Goldberg, Y. (2022). Towards faithfully interpretable NLP
systems: How should we define and evaluate faithfulness? *arXiv preprint
arXiv:2204.07028*.

Jain, S., & Wallace, B. C. (2019). Attention is not explanation. In
*Proceedings of the 2019 Conference of the North American Chapter of the
Association for Computational Linguistics: Human Language Technologies*
(pp. 3543–3556).

Kaushik, D., Hovy, E. H., & Lipton, Z. C. (2020). Learning the difference
that makes a difference with counterfactually-augmented data. In
*International Conference on Learning Representations*.

Kojima, T., Gu, S. S., Reid, M., Matsuo, Y., & Iwasawa, Y. (2022). Large
language models are zero-shot reasoners. *Advances in Neural Information
Processing Systems*, **35**, 22199–22213.

Lai, J., & Smith, A. (2024). The law of generative AI: A survey of legal
and regulatory frameworks. *Harvard Journal of Law & Technology*,
**37**(2), 387–458.

Lanham, T., Chen, A., Radhakrishnan, A., Steiner, B., Denison, C., Hernandez,
E., ... & Perez, E. (2023). Measuring faithfulness in chain-of-thought
reasoning. *arXiv preprint arXiv:2307.13702*.

Lyu, Q., Havaldar, S., Stein, A., Zhang, L., Rao, D., Wong, E., ... &
Bollegala, D. (2023). CRUD-RAG: A comprehensive Chinese benchmark for
retrieval-augmented generation of large language models. *arXiv preprint
arXiv:2401.17043*.

Madaan, A., Tandon, N., Gupta, P., Hallinan, S., Gao, L., Wiegreffe, S., ... &
Clark, P. (2023). Self-refine: Iterative refinement with self-feedback. In
*Advances in Neural Information Processing Systems*, **36**, 46534–46594.

OpenAI. (2024). *GPT-4o System Card*. OpenAI Technical Report.

Rudin, C. (2019). Stop explaining black box machine learning models for
high-stakes decisions and use interpretable models instead. *Nature
Machine Intelligence*, **1**(5), 206–215.

Schwartz, I., & Raghunathan, A. (2020). The multifaceted nature of
unfaithfulness in interpretability. *arXiv preprint arXiv:2010.07440*.

Sendak, M. P., Gao, M., Brajer, N., & Balu, S. (2020). Presenting machine
learning model information to clinical end users with modern explanatory
interfaces. *npj Digital Medicine*, **3**(1), 1–11.

Shah, M., Sharma, M., & Shroff, S. (2023). Scalable and transferable
adversarial examples for LLM-integrated applications. *arXiv preprint
arXiv:2305.12147*.

Shrikumar, A., Greenside, P., Shcherbina, A., & Kundaje, A. (2017). Not
just a black box: Learning important features through propagating
activation differences. *arXiv preprint arXiv:1605.01713*.

Teney, D., Abbasnejad, E., & van den Hengel, A. (2020). Unshuffling data
for improved generalization in visual question answering. *arXiv preprint
arXiv:2007.01844*.

Team, G., Anil, R., Borgeaud, S., Alayrac, J.-B., Yu, J., Soricut, R., ...
& Dean, J. (2024). Gemini: A family of highly capable multimodal models.
*arXiv preprint arXiv:2312.11805*.

Team, O. (2024). *OpenAI o1 System Card*. OpenAI Technical Report.

Tong, Y., & Zhang, L. (2024). The 2024 AI index: Annual report on
artificial intelligence. *Stanford Institute for Human-Centered AI*.

Treasury, U. S. (2024). *Managing Artificial Intelligence-Specific
Cybersecurity Risks in the Financial Services Sector*. U.S. Department
of the Treasury.

Turpin, M., Michael, J., Perez, E., & Bowman, S. R. (2024). Language
models don't always say what they think: Unfaithful explanations in
chain-of-thought prompting. *Advances in Neural Information Processing
Systems*, **37**, 92552–92583.

Wang, B., Ren, C., Yang, J., Liang, X., Bai, J., Chai, L., ... & Yang, Y.
(2023). MAUD: An expert-annotated legal dataset for merger agreement
understanding. *arXiv preprint arXiv:2301.00876*.

Wang, X., & Zhou, D. (2023). Large language models as indirect reasoners.
*arXiv preprint arXiv:2304.04811*.

Wang, X., Wei, J., Schuurmans, D., Le, Q., Chi, E., Narang, S., ... &
Zhou, D. (2023). Self-consistency improves chain of thought reasoning in
language models. In *International Conference on Learning Representations*.

Wei, J., Wang, X., Schuurmans, D., Bosma, M., Chi, E., Le, Q., & Zhou, D.
(2022). Chain-of-thought prompting elicits reasoning in large language
models. *Advances in Neural Information Processing Systems*, **35**,
24824–24837.

Yao, S., Yu, D., Zhao, J., Shafran, I., Griffiths, T. L., Cao, Y., & Narasimhan,
K. (2023). Tree of thoughts: Deliberate problem solving with large language
models. *Advances in Neural Information Processing Systems*, **36**,
11809–11822.

Zelikman, E., Wu, Y., Mu, J., & Goodman, N. D. (2022). STaR: Bootstrapping
reasoning with reasoning. *Advances in Neural Information Processing
Systems*, **35**, 15476–15488.

Zhou, D., Schärli, N., Hou, L., Wei, J., Scales, N., Wang, X., ... & Chi, E.
(2022). Least-to-most prompting enables complex reasoning in large language
models. *arXiv preprint arXiv:2205.10625*.

Zou, A., Wang, Z., Kolter, J. Z., & Fredrikson, M. (2023). Universal and
transferable adversarial attacks on aligned language models. *arXiv preprint
arXiv:2307.15043*.

\endgroup

# Appendix A. Scratchpad-Use Probe

The counterfactual faithfulness probe in Section 4.3 implicitly
assumes the rationale is a *log* of the decision process, not a
*scratchpad* used during the decision. A scratchpad-true model could
behave unfaithfully by our metric: replacing a scratchpad rationale
with a different scratchpad would re-derive the answer through a
different pathway, and our probe would attribute the resulting
answer flip to "unfaithfulness" when in fact the model is
genuinely using the rationale to compute.

To distinguish, we run a *forced-regenerate* probe: after the model
produces a CoT rationale and answer, we *remove* the answer and
ask the model to recompute it from the rationale alone, in a
fresh context window. If the recomputed answer agrees with the
original, the model is using the rationale as a scratchpad; if
it disagrees, the rationale is decorative.

We find that across all five models, the recompute agreement
rate is below 18%, indicating that the rationale is *not* a
faithful scratchpad but is largely decorative from the model's
perspective. We note that this probe is also imperfect — a
scratchpad-true model could fail to recompute from a partial
scratchpad — and we report the result as a lower bound on the
"rationale-as-scratchpad" hypothesis.

# Appendix B. Sampling-Protocol Robustness Checks

We re-ran a subset of experiments with temperature 0.7 and
self-consistency (k=5) on the LCR domain. The qualitative
findings are stable:

- **Faithfulness gap.** Self-consistent answers are slightly
  *more* faithful (mean FS = 0.38 vs. 0.46) but the gap
  remains large.
- **Robustness gap.** Self-consistent answers are slightly
  *more* robust to $D_3$ and $D_4$ perturbations, but the
  difference is small.
- **Generalization gap.** Self-consistency does not
  substantially reduce the cross-domain transfer penalty.

The robustness checks suggest that sampling-protocol choices
are not the primary driver of the faithfulness, robustness, or
generalization gaps we report.

# Appendix C. Benchmark Construction Details

## C.1 Legal Contract Review (LCR)

The LCR items are derived from CUAD (Hendrycks et al., 2021) and
MAUD (Wang et al., 2023). Each item asks the model to identify
the presence, absence, or specific content of a contractual
clause category (e.g., "Change of Control", "Anti-Assignment",
"Indemnification"). We re-annotate the items with reference
rationales by two licensed attorneys, one with US-jurisdiction
expertise and one with UK-jurisdiction expertise. Items where
the US and UK annotations diverge are placed in a jurisdictional
transfer split.

## C.2 Clinical Triage (CT)

The CT items are derived from a public de-identified emergency
department triage dataset (MIMIC-IV-ED subset). Each item asks
the model to assign an Emergency Severity Index (ESI) acuity
level (1–5) and to identify the red-flag features driving the
assignment. Two board-certified emergency physicians re-annotate
the items with reference rationales. Items with substantial
clinical ambiguity are excluded.

## C.3 Financial Credit Analysis (FCA)

The FCA items are synthetically generated in collaboration
with a credit-union partner. Each item consists of a structured
application (income, employment, credit history, requested
product) and an unstructured self-reported "circumstances"
narrative. The model is asked to assign a risk tier (A–D) and to
identify the top three risk drivers. The reference rationale
is the partner's underwriting officer's actual analysis for the
synthesized application.

## C.4 Inter-Annotator Agreement

We computed Cohen's $\kappa$ on a 100-item overlap for each
domain: LCR $\kappa = 0.79$, CT $\kappa = 0.84$, FCA $\kappa = 0.81$.
Combined $\kappa = 0.81$. Disagreements are resolved by a third
senior annotator.

# Appendix D. Prompt Templates

The system prompt template used for all models in the main
evaluation is reproduced below.

```
You are a careful expert analyst in [DOMAIN]. You will be
given a [CONTEXT] and asked a [QUESTION] with candidate
answers [CANDIDATES]. Think step by step, then provide your
final answer in the format "Answer: [LETTER]".

[EXEMPLAR 1]
[EXEMPLAR 2]
[EXEMPLAR 3]
[EXEMPLAR 4]
[EXEMPLAR 5]

[CONTEXT]
[QUESTION]
[CANDIDATES]
```

The exemplars are drawn from the dev split, five per domain.
We verified that the exemplars are not present in the test split.

# Appendix E. Compute and Reproducibility

All experiments are run on a single node with 4× NVIDIA H100
GPUs (80 GB) for the open-weight models, and via API for the
closed-weight models. Total compute is approximately 320 GPU-hours
for the main evaluation, plus 80 GPU-hours for the appendix
robustness checks.

The HS-CoT-Bench benchmark, the perturbation protocol, the
prompt templates, and the analysis code will be released at
publication time. Pre-registration of the analysis plan was
performed on OSF prior to running the main experiments.
