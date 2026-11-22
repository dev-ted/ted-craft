# Metrics baseline

Capture at day 0, before any feature work. You cannot show improvement you never measured. Perception of speed is not a metric.

Per area, write the team's honest estimate of what this would take by hand. Then capture actuals as you go.

```markdown
# Baseline: <project> <date>

## Manual-effort estimate (consensus, written before build)

- Area: _  Estimate: _

## Actuals (fill as you go)

- Elapsed to first working result:
- Increments, split by `ai:` label:
- Review accept / sent-back counts:
- Test count:
- Quality checks (a11y, real-device, completion):

## Method

How each number was produced. Without this, the comparison is hindsight.
```

Track beside these: pickup time, review time, branch age per increment, share of increments accepted with zero findings, duplication, CI minutes per increment, time to first useful signal.

A pull request counts as sent back if it carries a "changes requested" review, more than one review round, or the `review:sent-back` label.
