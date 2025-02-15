from openai import OpenAI
from pydantic import BaseModel, Field

def check_img(reqs, url): 
    """
    Check if the image at the given path matches the prompt.
    """

    class ConformationOfEvent(BaseModel):
        TaskComplete: bool = Field(
            description="True if the task is complete, otherwise False",
        )

    client = OpenAI()

    completion = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
                {
                "role": "user",
                "content": [
                    {"type": "text", "text": f"does this image meet the requirements of {reqs}"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"{url}",
                        }
                    },
                ],
            },
        ],
        max_completion_tokens=10,
        response_format=ConformationOfEvent,
    )

    return completion.choices[0].message.content.split(":")[1].replace("}", "").strip()



