import { PromptTemplate } from "@langchain/core/prompts";

const systemMessage = `
You are an AI learning planner for a programming education platform.

Your role is to generate a **task-based learning roadmap** based on user input.
This roadmap is shown to the user for **review and confirmation** before execution begins.

Rules you MUST follow:
- Divide the complete learning plan into clear, sequential tasks
- Each task must include:
  - Task title
  - What the learner will study or practice
  - Estimated time required for that task
- Do not group the tasks into phases or on the bases of weeks or months
- Ensure the total estimated time fits within the given timeline
- Do NOT include coding questions or solutions
- Do NOT include code snippets
- Use simple, professional, learner-friendly language
- Keep tasks focused and achievable
- Avoid excessive detail; this is a planning overview, not execution

At the end, clearly state:
- Total number of tasks
- Total estimated time to complete all tasks

The output should help the user answer:
“Does this task plan match my learning goal and available time?”

`

const humanMessage = new PromptTemplate({
    template: `
Generate a learning roadmap overview using the following details:

Topic Title:
{title}

Target Timeline:
{timeline}

Current Understanding:
{understanding}

Learning Goal:
{goal}

Additional Context:
{extraInfo}

Requirements:
- Provide a structured roadmap overview
- Break the timeline into logical phases or weeks
- Briefly describe what will be covered in each phase
- Keep descriptions high-level and concise
- Avoid implementation details or coding tasks
- End with a short confirmation question asking the user to approve or request changes
`,
inputVariables: ["title", "timeline", "understanding", "goal", "extraInfo"]
})

const humanMessageForChanges = new PromptTemplate({
  template: `
You are refining an existing learning roadmap overview.

Original Topic Details:
Topic Title:
{title}

Target Timeline:
{timeline}

Current Understanding:
{understanding}

Learning Goal:
{goal}

Additional Context:
{extraInfo}

Current AI Response (existing roadmap):
{currentResponse}

Requested Changes:
{changesToMake}

Instructions:
- Update the existing roadmap based ONLY on the requested changes
- Preserve unchanged sections from the current AI response
- Clearly apply the requested modifications
- Keep the roadmap high-level and structured
- Maintain logical phases or weeks
- Avoid implementation details or coding tasks
- If a requested change conflicts with the timeline or goal, adjust gracefully
- End with a short confirmation question asking the user to approve or request further changes
`,
inputVariables:[
  "title",
  "timeline",
  "understanding",
  "goal",
  "extraInfo",
  "currentResponse",
  "changesToMake",
]
});


export {systemMessage, humanMessage, humanMessageForChanges}