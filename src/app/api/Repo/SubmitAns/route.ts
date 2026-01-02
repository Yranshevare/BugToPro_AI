import prisma from "@/lib/prisma";
import response from "@/lib/Reaponse";
import { NextRequest } from "next/server";
import GenrateExplanationWorkflow from "@/app/Workflow/GenrateExplanation";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // console.log("Received body:", body);

        if (!body.repoId) {
            return response({ message: "repoId is required", status: 400 });
        }

        if (!body.taskNumber) {
            return response({ message: "taskNumber is required", status: 400 });
        }

        if (!body.answer) {
            return response({ message: "answer is required", status: 400 });
        }

        if (body.questionNo === undefined) {
            return response({ message: "questionNo is required", status: 400 });
        }
        
        if(!body.token) {
            return response({ message: "Unauthorized, token not found", status: 401 });
        }

        const { data: { user }, error } = await supabaseServer.auth.getUser(body.token);

        if (error || !user) {
            return response({ message: "Unauthorized, user not found", status: 401 });
        }
        // console.log(`Submitting answer for repoId: ${body.repoId}, taskNumber: ${body.taskNumber}`);
        // console.log(`Answer: ${body.answer}`);

        const repoId = body.repoId;
        const taskNumber = body.taskNumber;
        const questionNo = body.questionNo;

        const repo = await prisma.repo.findUnique({
            where: {
                id: repoId,
            },
        });

        if (!repo) {
            return response({ message: "Repo not found", status: 404 });
        }

        if(repo.userId !== user.id){
            return response({ message: "Unauthorized, not the owner", status: 401 });
        }

        const task = repo.tasks[taskNumber - 1];

        if (!task) {
            return response({ message: "Task not found", status: 404 });
        }

        
        const question = task.assignments[questionNo]?.question;
        const taskDescription = task.taskDescription;
        const taskSolution = body.answer;
        
        if (!question) {
            return response({ message: "Question not found", status: 404 });
        }

        const initialState = {
            taskDescription: taskDescription,
            taskSolution: taskSolution,
            question: question,
        }        
        
        console.log(taskDescription);   // The learner will review basic JavaScript syntax, variables, data types, functions, control flow, and get an introduction to what Node.js is and its runtime environment.
        const explanation = await GenrateExplanationWorkflow.invoke(initialState);

        if (!explanation || !explanation.explanation) {
            return response({ message: "Failed to generate explanation", status: 500 });
        }

        // update the answer in the database
        task.assignments[questionNo].answer = body.answer;
        task.assignments[questionNo].explanation = explanation.explanation as string;

        let taskComplete = true
        task.assignments.forEach((assignment) => {
            if (!assignment.answer) {
                taskComplete = false;
            }
        })

        if (taskComplete) {
            task.completed = true;
        }
        
        repo.tasks[taskNumber - 1] = task;
        if(repo.completedTasks < repo.noOfTasks){
            repo.completedTasks += 1;
        }

        await prisma.repo.update({
            where: {
                id: repoId,
            },
            data: {
                tasks: repo.tasks,
            },
        });

        return response({ message: "Answer submitted successfully", status: 200, data: { explanation: explanation.explanation, question } });
    } catch (error: any) {
        return response({ message: "Internal Server Error", status: 500, error: error.message });
    }
}
