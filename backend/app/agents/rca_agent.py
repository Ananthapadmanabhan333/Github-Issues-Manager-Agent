import os
from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langchain_core.prompts import ChatPromptTemplate
import logging

logger = logging.getLogger(__name__)

# ---------------------------------------------------------
# 1. Define the State
# ---------------------------------------------------------
class RCAState(TypedDict):
    issue_id: str
    issue_description: str
    stack_trace: str
    related_commits: list[str]
    retrieved_code: str
    messages: Annotated[Sequence[BaseMessage], operator.add]
    root_cause_analysis: str
    proposed_fix: str

# ---------------------------------------------------------
# 2. Define the Nodes
# ---------------------------------------------------------
def fetch_code_context(state: RCAState) -> RCAState:
    """
    Simulates fetching AST-aware code chunks from Qdrant based on the stack trace.
    In a real system, this queries the `code_embeddings` collection.
    """
    logger.info(f"Fetching code context for issue: {state['issue_id']}")
    # Mock retrieval logic
    retrieved = "def calculate_velocity(sp, days):\n    return sp / days  # ZeroDivisionError potential"
    return {"retrieved_code": retrieved}

def analyze_root_cause(state: RCAState) -> RCAState:
    """
    Uses GPT-4o to analyze the stack trace and retrieved code.
    """
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a Senior Staff Software Engineer analyzing a bug. "
                   "Given the issue description, stack trace, and relevant code, "
                   "write a highly detailed root-cause analysis."),
        ("human", "Description: {description}\n\nStack Trace: {stack}\n\nCode Context: {code}")
    ])
    
    chain = prompt | llm
    response = chain.invoke({
        "description": state["issue_description"],
        "stack": state["stack_trace"],
        "code": state["retrieved_code"]
    })
    
    return {"root_cause_analysis": response.content}

def generate_fix(state: RCAState) -> RCAState:
    """
    Proposes an AST-safe patch based on the RCA.
    """
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an Autonomous PR Generation Agent. "
                   "Write a patch to fix the bug identified in the root cause analysis."),
        ("human", "Root Cause: {rca}\n\nCode: {code}")
    ])
    
    chain = prompt | llm
    response = chain.invoke({
        "rca": state["root_cause_analysis"],
        "code": state["retrieved_code"]
    })
    
    return {"proposed_fix": response.content}

# ---------------------------------------------------------
# 3. Build the Graph
# ---------------------------------------------------------
workflow = StateGraph(RCAState)

workflow.add_node("fetch_context", fetch_code_context)
workflow.add_node("analyze", analyze_root_cause)
workflow.add_node("generate_fix", generate_fix)

workflow.set_entry_point("fetch_context")
workflow.add_edge("fetch_context", "analyze")
workflow.add_edge("analyze", "generate_fix")
workflow.add_edge("generate_fix", END)

# Compile the autonomous RCA loop
rca_app = workflow.compile()

if __name__ == "__main__":
    # Example local execution
    initial_state = {
        "issue_id": "COG-102",
        "issue_description": "Division by zero on dashboard load when sprint days is 0",
        "stack_trace": "ZeroDivisionError: division by zero in calculate_velocity",
        "related_commits": [],
        "retrieved_code": "",
        "messages": [],
        "root_cause_analysis": "",
        "proposed_fix": ""
    }
    
    final_state = rca_app.invoke(initial_state)
    print("=== ROOT CAUSE ===")
    print(final_state["root_cause_analysis"])
    print("\n=== PROPOSED FIX ===")
    print(final_state["proposed_fix"])
