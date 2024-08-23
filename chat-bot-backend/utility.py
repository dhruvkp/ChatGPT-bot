import os
from openai import AzureOpenAI


API_KEY = os.getenv('GPT_API_KEY')

# Initialize the Azure OpenAI client
client = AzureOpenAI(
        azure_endpoint = 'https://chatboat-instance.openai.azure.com/', 
        api_key=API_KEY,  
        api_version="2023-09-15-preview" #  Target version of the API, such as 2024-02-15-preview
        )


## Helper function
def get_completion(prompt, model="chatbot-model", temperature=0):
    messages = [{"role": "user",
                "content": prompt}]
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
    )
    return response.choices[0].message["content"]


## Helper function for conversation
def get_completion_from_messages(messages, model="chatbot-model", temperature=0):
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
    )
    return response.choices[0].message.content


def collect_messages(prompt: str, context: list, temperature=0):
    context.append({'role': 'user', 'content': f'{prompt}'})
    response = get_completion_from_messages(context, temperature=temperature)
    # response = "HI!!"
    context.append({'role': 'assistant', 'content': f'{response}'})

    return {'context': context}