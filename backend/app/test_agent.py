import asyncio
import websockets
import json

async def test_agent():
    uri = "ws://localhost:8000/ws/execute"
    async with websockets.connect(uri) as websocket:
        # Sample agent data
        test_data = {
            "agent": {
                "id": "test-1",
                "name": "Test Agent",
                "systemPrompt": "You are a helpful AI assistant.",
                "tools": [
                    {
                        "name": "search",
                        "description": "Search for information",
                        "parameters": [
                            {
                                "name": "query",
                                "type": "string",
                                "description": "Search query",
                                "required": True
                            }
                        ]
                    }
                ]
            },
            "query": "What is the weather like?"
        }
        
        # Send data
        await websocket.send(json.dumps(test_data))
        
        # Listen for responses
        while True:
            try:
                response = await websocket.recv()
                print(f"Received: {response}")
            except websockets.exceptions.ConnectionClosed:
                break

asyncio.run(test_agent())
