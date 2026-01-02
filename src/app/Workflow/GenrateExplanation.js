import { END, START, StateGraph } from "@langchain/langgraph";
import { z } from "zod";
import { llm } from "./Models/LLM";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { explanationHumanPrompt, explanationSystemPrompt } from "./prompts/GenrateExplanation";

const GenrateExplanationInputSchema = z.object({
    taskDescription: z.string(),
    taskSolution: z.string(),
    question: z.string(),
    explanation: z.string(),
});

const graph = new StateGraph(GenrateExplanationInputSchema );

async function GenrateExplanation(state) {
    const humanMessage = await explanationHumanPrompt.format({
        taskDescription: state.taskDescription,
        taskSolution: state.taskSolution,
        question: state.question,
    });
    const message = [
        new SystemMessage(explanationSystemPrompt),
        new HumanMessage(humanMessage)
    ];
    const ans = await llm.invoke(message);
    return { explanation: ans.content };
}
graph.addNode("GenrateExplanation", GenrateExplanation);

graph.addEdge(START, "GenrateExplanation");
graph.addEdge("GenrateExplanation", END);
const GenrateExplanationWorkflow = graph.compile();

export default GenrateExplanationWorkflow;
