from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.exception import AppwriteException
import os
import os
from openai import OpenAI
from pydantic import BaseModel, Field

def check_img(res,reqs, url):
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

        print(response_content)
        
        return res.json({"raw_response": response_content})

    except Exception as e:
        return res.json({"error": str(e)}, 500)



def main(context):
    client = (
        Client()
        .set_endpoint(os.environ["APPWRITE_FUNCTION_API_ENDPOINT"])
        .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
        .set_key(context.req.headers["x-appwrite-key"])
    )
    
    return context.res.json(
        check_img(
            context.res,
            context.req.json["requirements"],
            context.req.json["image_url"]
        )
    )
