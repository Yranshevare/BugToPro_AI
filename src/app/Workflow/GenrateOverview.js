import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import {z} from "zod";
import {llm} from "./Models/LLM";
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { humanMessage, systemMessage } from "./prompts/GenerateOverview";

const schema = Annotation.Root({
    messages: Annotation({
        schema: z.array(z.instanceof(BaseMessage)),
        reducer: (a, b) => a.concat(b),
        default:()=>[]
    })
})

const graph = new StateGraph(schema);

async function GenerateOverview(state) {
    const res = await llm.invoke(state.messages);
    return {messages: [res]};
} 
graph.addNode("GenerateOverview", GenerateOverview);


graph.addEdge(START, "GenerateOverview");
graph.addEdge("GenerateOverview", END);

const GenerateOverviewWorkflow = graph.compile();

export default GenerateOverviewWorkflow

