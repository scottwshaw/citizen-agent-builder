from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import json
from dotenv import load_dotenv
import os
from openai import AsyncOpenAI

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

class Tool(BaseModel):
    name: str
    description: str
    parameters: List[dict]

class Agent(BaseModel):
    id: str
    name: str
    systemPrompt: str
    tools: List[Tool]

class ExecutionStep(BaseModel):
    type: str  # 'reasoning' | 'action' | 'observation'
    content: str
#    timestamp: datetime

#    class Config:
#        json_encoders = {
#            datetime: lambda dt: dt.isoformat()
#        }


async def send_step(websocket: WebSocket, step_type: str, content: str):
    step = ExecutionStep(
        type=step_type,
        content=content,
 #       timestamp=datetime.now()
    )
    print(step)
    await websocket.send_json(step.model_dump())

@app.websocket("/ws/execute")
async def execute_agent(websocket: WebSocket):
    await websocket.accept()
    try:
        # Get initial data
        data = await websocket.receive_json()
        agent = Agent(**data['agent'])
        query = data['query']
        # Initialize conversation with system prompt and query
        messages = [
            {"role": "system", "content": agent.systemPrompt},
            {"role": "user", "content": query}
        ]

        print(messages)

        max_turns = 2  # Prevent infinite loops
        turn = 0
        
        while turn < max_turns:
            # REASONING PHASE
            print("REASONING PHASE")
            await send_step(websocket, "reasoning", "Analyzing situation and deciding next action...")
            print("sending to openai")
            response = await client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )

            reasoning = response.choices[0].message.content
            messages.append({"role": "assistant", "content": reasoning})
            await send_step(websocket, "reasoning", reasoning)
            
            # Check for completion
            if "TASK COMPLETE" in reasoning.upper():
                await send_step(websocket, "observation", "Task completed successfully")
                break
                
            # ACTION PHASE
            try:
                # Parse the action from reasoning
                # Expecting format: "ACTION: <tool_name> <parameters>"
                if "ACTION:" in reasoning:
                    action_part = reasoning.split("ACTION:")[1].strip()
                    tool_name = action_part.split()[0]
                
                    # Verify tool exists
                    tool = next((t for t in agent.tools if t.name == tool_name), None)
                    if not tool:
                        await send_step(websocket, "observation", f"Tool {tool_name} not found")
                        break          
                    await send_step(websocket, "action", f"Executing tool: {tool_name}")
                else:
                    await send_step(websocket, "observation", "No clear action specified in reasoning")
                    break
                
                # OBSERVATION PHASE
                # For now, simulate tool execution with a placeholder
                # In a real implementation, you'd execute the tool here
                observation = f"Simulated observation for {tool_name}"
                await send_step(websocket, "observation", observation)
                
                # Add observation to conversation
                messages.append({"role": "user", "content": f"Observation: {observation}"})
                
            except Exception as e:
                await send_step(websocket, "observation", f"Error executing action: {str(e)}")
            
            turn += 1
            print(f"Turn {turn}")
            
        if turn >= max_turns:
            await send_step(websocket, "observation", "Maximum turns reached, stopping execution")
            
    except Exception as e:
        await websocket.send_json({
            "type": "error",
            "content": str(e),
            "timestamp": datetime.now().isoformat()
        })
    finally:
        await websocket.close()

@app.get("/")
def read_root():
    return {"status": "ok"}
