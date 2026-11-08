# Craft bar

Apply when the change has a user interface, or when the user says the screen is slow. Use the toolkit, components, and tokens this project already has. Do not bring in a library, token set, or component kit that is not here.

## Maintainable over short

- Pick the option a later reader understands in one pass. Three plain lines beat a clever line.
- A new component, class, or helper needs a job the existing ones cannot do. Compose or extend what is already there.
- Follow the project's components, tokens, spacing, and layout. Do not invent a second button, color, or spacing scale.
- If the layout or interaction is not specified and the project has no pattern to copy, ask one question. Do not improvise a new screen.

## Finish the interface

- Hierarchy, spacing, and type make the primary action obvious. One primary action per view.
- Drop decoration that does not help the task. Avoid a field of identical cards and type so quiet the action disappears.
- Every view that loads data handles loading, empty, and error. Show an error the user must act on. Do not hide a failure in an empty catch.
- Keep semantic structure, keyboard use, visible focus, labels, and contrast. Color is not the only signal. Do not remove any of this to save lines.
- If the project has more than one theme, check each theme. A dark surface stays dark. A light surface stays light.
- If people use the UI by touch, keep the project's hit area. Do not invent a second layout the project does not have.

## Motion

- Add motion only when it explains a change: what opened, what moved, what arrived.
- Use the motion approach the project already has. Do not add a motion library for a fade.
- Animate transform and opacity. Do not animate properties that force layout on every frame.
- If the project already honors reduced motion, keep that path.

## When it is slow

Measure the cost before you restructure: extra requests, work repeated per row, rendering the same tree again, assets larger than the screen. Remove that cost. Do not add a cache, memo layer, or abstraction for later.
