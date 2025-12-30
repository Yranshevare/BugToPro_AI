import { END, START, StateGraph } from "@langchain/langgraph";
import { z } from "zod";
import { StructuredLLM } from "./Models/LLM";
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { systemMessageForStructuredOutput } from "./prompts/GenrateStructuredOutput";

const outputSchema = z.array(
    z.object({
        taskNumber: z.number(),
        taskTitle: z.string(),
        taskDescription: z.string(),
        estimatedTime: z.string(),
        assignments: z.array(z.string()),
    })
);

const gaphSchema = z.object({
    input: z.string(),
    output: outputSchema,
});

const llm = StructuredLLM(outputSchema);

const graph = new StateGraph(gaphSchema);

async function GenerateStructuredOutput(state) {
    const message = [new SystemMessage(systemMessageForStructuredOutput), new HumanMessage(state.input)];
    const res = await llm.invoke(message);
    return { output: res };
}
graph.addNode("GenerateStructuredOutput", GenerateStructuredOutput);

graph.addEdge(START, "GenerateStructuredOutput");
graph.addEdge("GenerateStructuredOutput", END);

const GenerateStructuredOutputWorkflow = graph.compile();

export default GenerateStructuredOutputWorkflow;
