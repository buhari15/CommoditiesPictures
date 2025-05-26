
from langchain import hub
from langchain.agents import (
    AgentExecutor,
    create_react_agent,
)
from langchain_core.tools import Tool
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.tools.wikipedia.tool import WikipediaQueryRun
from langchain_community.utilities.wikipedia import WikipediaAPIWrapper
import os

from langchain_community.tools.google_scholar import GoogleScholarQueryRun
from langchain_community.utilities.google_scholar import GoogleScholarAPIWrapper

# Set Wikipedia language (optional)
wiki_wrapper = WikipediaAPIWrapper(lang="en")
wiki_tool = WikipediaQueryRun(api_wrapper=wiki_wrapper)
# from langsmith import Client as LangSmithClient

# Load environment variables from .env file


from scholarly import scholarly

def search_google_scholar(query: str) -> str:
    """Search Google Scholar and return the first result's title and abstract."""
    try:
        search_result = next(scholarly.search_pubs(query))
        title = search_result.get("bib", {}).get("title", "No title")
        abstract = search_result.get("bib", {}).get("abstract", "No abstract available.")
        return f"Title: {title}\nAbstract: {abstract}"
    except Exception as e:
        return f"Error during Scholar search: {str(e)}"


# client = LangSmithClient()
# Define a very simple tool function that returns the current time
def get_current_time(*args, **kwargs):
    """Returns the current time in H:MM AM/PM format."""
    import datetime  # Import datetime module to get current time

    now = datetime.datetime.now()  # Get current time
    return now.strftime("%I:%M %p")  # Format time in H:MM AM/PM format


# List of tools available to the agent
tools = [
    Tool(
        name="Time",  # Name of the tool
        func=get_current_time,  # Function that the tool will execute
        # Description of the tool
        description="Useful for when you need to know the current time",
    ),
    Tool(
        name="Wikipedia",
        func=wiki_tool.run,
        description="Useful for when you need to answer questions about general knowledge. Input should be a search query.",
    ),
    Tool(
        name="Google Scholar",
        func=search_google_scholar,
    description="Useful for finding academic research articles and abstracts related to a topic",
    ),
]

# Pull the prompt template from the hub
# ReAct = Reason and Action
# https://smith.langchain.com/hub/hwchase17/react

# template = """
# Answer the following questions as best you can. You have access to the following tools:

# {tools}

# Use the following format:

# Question: the input question you must answer
# Thought: you should always think about what to do
# Action: the action to take, should be one of [{tool_names}]
# Action Input: the input to the action
# Observation: the result of the action
# ... (this Thought/Action/Action Input/Observation can repeat N times)
# Thought: I now know the final answer
# Final Answer: the final answer to the original input question

# Begin!

# Question: {input}
# Thought:{agent_scratchpad}
# """

template = """
You are an intelligent research assistant that answers complex questions using the tools available.

You have access to the following tools:

{tools}

Use this format to reason through the problem step-by-step:

Question: the input question you must answer
Thought: you should always think about what to do next
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (repeat Thought/Action/Action Input/Observation as needed)
Thought: I now know the final answer
Final Answer: the complete answer to the original input question, including relevant insights or trends if applicable

Begin!

Question: {input}
Thought:{agent_scratchpad}
"""

prompt = ChatPromptTemplate.from_template(template)

# Initialize a ChatOpenAI model
llm = ChatOpenAI(
    model="lmistral-7b-instruct-v0.3",
    base_url="http://192.168.178.81:1234/v1", 
    temperature=0,
    api_key="your_api_key_here",  # Replace with your actual API key
)

# Create the ReAct agent using the create_react_agent function
agent = create_react_agent(
    llm=llm,
    tools=tools,
    prompt=prompt,
    stop_sequence=True,
)

# Create an agent executor from the agent and tools
agent_executor = AgentExecutor.from_agent_and_tools(
    agent=agent,
    tools=tools,
    verbose=True,
    handle_parsing_errors=True
)

def run_agent(input_text: str) -> str:
    result = agent_executor.invoke({"input": input_text})
    return result["output"]
