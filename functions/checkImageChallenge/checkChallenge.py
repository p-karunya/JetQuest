import os
from openai import OpenAI
from pydantic import BaseModel, Field

def check_img(req, res):
    """
    Check if the image at the given path matches the prompt.
    """
    # Define response schema
    class ConfirmationOfEvent(BaseModel):
        TaskComplete: bool = Field(
            description="True if the task is complete, otherwise False",
        )

    # Extract parameters from request payload
    try:
        payload = req.json
        reqs = payload.get("requirements")
        url = payload.get("image_url")

        # Validate inputs
        if not reqs or not url:
            return res.json({"error": "Missing 'requirements' or 'image_url'"}, 400)

        # Initialize OpenAI client with API key from environment variables
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

        # Make a call to OpenAI GPT-4o
        completion = client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"Does this image meet the requirements of {reqs}?"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": url,
                            }
                        },
                    ],
                },
            ],
            max_tokens=10,
        )

        # Parse response
        response_content = completion.choices[0].message.get("content", "")
        
        # Validate response format if required by schema
        parsed_response = ConfirmationOfEvent(TaskComplete=("true" in response_content.lower()))
        
        return res.json({"task_complete": parsed_response.TaskComplete, "raw_response": response_content})

    except Exception as e:
        return res.json({"error": str(e)}, 500)



