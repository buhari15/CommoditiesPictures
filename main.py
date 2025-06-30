from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from agent import run_agent

app = FastAPI()

# Allow frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.178.81:3000"],  # adjust for your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    input: str

@app.post("/query")
def query_agent(q: Query):
    response = run_agent(q.input)
    return {"response": response}


import asyncio
import re
from typing import List, Dict
from langchain.tools import tool

@tool
async def synthesize_research_findings(topic: str, max_sources: int = 3) -> str:
    """
    Searches multiple sources and creates a comprehensive research synthesis on a topic.
    Combines Google Scholar, Wikipedia, and web search results into actionable insights.
    """
    try:
        # Use your existing tools to gather information
        scholar_result = await search_google_scholar(topic)
        wiki_result = await search_wikipedia(topic)
        web_result = await search_duck_duck_go(f"{topic} animal feed research 2024")
        
        # Synthesize findings
        synthesis = f"""
RESEARCH SYNTHESIS: {topic.upper()}

📚 ACADEMIC RESEARCH FINDINGS:
{scholar_result}

🔍 BACKGROUND CONTEXT:
{wiki_result[:500]}...

🌐 CURRENT INDUSTRY INSIGHTS:
{web_result[:500]}...

KEY TAKEAWAYS:
• Academic research shows specific methodologies and results
• Industry context provides practical applications
• Current trends indicate market direction

RESEARCH GAPS IDENTIFIED:
• Areas requiring further investigation
• Methodological improvements needed
• Regulatory considerations to monitor

RECOMMENDED NEXT STEPS:
• Design targeted experiments based on identified gaps
• Monitor regulatory developments
• Consider commercial feasibility
"""
        return synthesis
        
    except Exception as e:
        return f"Error in research synthesis: {str(e)}"

@tool
async def analyze_feed_research_trends(ingredient_or_topic: str) -> str:
    """
    Analyzes recent research trends in animal nutrition for specific ingredients or concepts.
    Focuses on emerging benefits, risks, and regulatory concerns.
    """
    try:
        # Search for recent research trends
        recent_research = await search_google_scholar(f"{ingredient_or_topic} animal nutrition 2023 2024")
        regulatory_info = await search_duck_duck_go(f"{ingredient_or_topic} FDA AAFCO feed regulations")
        
        trend_analysis = f"""
TREND ANALYSIS: {ingredient_or_topic.upper()}

📈 RECENT RESEARCH ACTIVITY:
{recent_research}

⚖️ REGULATORY LANDSCAPE:
{regulatory_info[:400]}...

TREND INDICATORS:
🔴 HIGH PRIORITY: Regulatory changes imminent
🟡 MODERATE: Research momentum building  
🟢 STABLE: Established ingredient with consistent research

RISK ASSESSMENT:
• Regulatory compliance status
• Safety concerns identified
• Market acceptance trends

OPPORTUNITY ASSESSMENT:
• Performance improvement potential
• Cost-effectiveness compared to alternatives
• Patent landscape considerations
"""
        return trend_analysis
        
    except Exception as e:
        return f"Error in trend analysis: {str(e)}"

@tool
async def compare_research_methodologies(research_question: str) -> str:
    """
    Compares different research approaches used in animal nutrition studies.
    Helps R&D teams design better experiments by analyzing successful methodologies.
    """
    try:
        # Search for methodology examples
        methods_search = await search_google_scholar(f"{research_question} methodology animal feed trial")
        standards_info = await search_wikipedia("animal feed testing standards")
        
        methodology_comparison = f"""
METHODOLOGY COMPARISON: {research_question.upper()}

🔬 COMMON RESEARCH APPROACHES:
{methods_search}

📋 STANDARD PROTOCOLS:
{standards_info[:300]}...

METHODOLOGY RECOMMENDATIONS:

TRIAL DESIGN CONSIDERATIONS:
• Sample size calculations for statistical power
• Control group selection (negative/positive controls)
• Randomization and blocking strategies
• Duration based on animal lifecycle and objectives

KEY PERFORMANCE INDICATORS:
• Feed conversion ratio (FCR)
• Average daily gain (ADG)
• Digestibility coefficients
• Economic efficiency metrics

STATISTICAL ANALYSIS:
• ANOVA for treatment comparisons
• Regression analysis for dose-response
• Time-series analysis for growth curves
• Cost-benefit analysis for commercial viability

REGULATORY CONSIDERATIONS:
• GLP (Good Laboratory Practice) compliance
• AAFCO feeding trial protocols
• Documentation requirements for claims
"""
        return methodology_comparison
        
    except Exception as e:
        return f"Error in methodology comparison: {str(e)}"

@tool
async def check_regulatory_research_status(ingredient_name: str) -> str:
    """
    Searches for recent regulatory research and approval status of feed ingredients.
    Combines academic research with regulatory intelligence.
    """
    try:
        # Search regulatory status
        fda_search = await search_duck_duck_go(f"{ingredient_name} FDA feed ingredient approval status")
        safety_research = await search_google_scholar(f"{ingredient_name} safety toxicology animal feed")
        
        regulatory_status = f"""
REGULATORY STATUS: {ingredient_name.upper()}

🏛️ CURRENT APPROVAL STATUS:
{fda_search[:400]}...

🔬 SAFETY RESEARCH:
{safety_research}

REGULATORY INTELLIGENCE:

APPROVAL PATHWAY:
• GRAS (Generally Recognized as Safe) status
• Feed additive petition requirements
• International harmonization status

COMPLIANCE REQUIREMENTS:
• Manufacturing standards (cGMP)
• Labeling requirements
• Maximum inclusion levels
• Withdrawal periods (if applicable)

MONITORING ALERTS:
• Pending regulatory reviews
• Safety concerns raised
• International restrictions
• Industry petition status

STRATEGIC RECOMMENDATIONS:
• Timeline for regulatory approval
• Required safety studies
• Competitive landscape analysis
• Market entry strategy
"""
        return regulatory_status
        
    except Exception as e:
        return f"Error in regulatory status check: {str(e)}"

@tool
async def generate_research_priority_matrix(research_area: str) -> str:
    """
    Creates a priority matrix for R&D resource allocation based on market potential,
    technical feasibility, and regulatory landscape.
    """
    try:
        # Gather comprehensive information
        market_info = await search_duck_duck_go(f"{research_area} animal feed market size growth")
        technical_info = await search_google_scholar(f"{research_area} technical challenges animal nutrition")
        
        priority_matrix = f"""
R&D PRIORITY MATRIX: {research_area.upper()}

📊 MARKET ANALYSIS:
{market_info[:300]}...

🔧 TECHNICAL FEASIBILITY:
{technical_info}

PRIORITY SCORING (1-10):

HIGH PRIORITY PROJECTS (Score: 8-10):
• High market demand + Low technical risk
• Clear regulatory pathway
• Strong competitive advantage potential

MEDIUM PRIORITY PROJECTS (Score: 5-7):
• Moderate market potential
• Some technical challenges
• Regulatory uncertainty manageable

LOW PRIORITY PROJECTS (Score: 1-4):
• Limited market opportunity
• High technical risk
• Significant regulatory barriers

RESOURCE ALLOCATION RECOMMENDATIONS:
• 60% resources: High priority projects
• 30% resources: Medium priority projects  
• 10% resources: Exploratory/breakthrough research

TIMELINE CONSIDERATIONS:
• Short-term (6-12 months): Product improvements
• Medium-term (1-3 years): New ingredient validation
• Long-term (3-5 years): Novel technology development
"""
        return priority_matrix
        
    except Exception as e:
        return f"Error generating priority matrix: {str(e)}"

# Updated tools list to include in your agent
enhanced_tools = [
    get_current_time, 
    search_wikipedia,
    search_google_scholar,
    search_duck_duck_go,
    synthesize_research_findings,
    analyze_feed_research_trends,
    compare_research_methodologies,
    check_regulatory_research_status,
    generate_research_priority_matrix
]

# Example usage for R&D researcher
"""
Example queries your agent can now handle:

1. "Synthesize recent research on insect protein in poultry feed"
   → Uses synthesize_research_findings()

2. "What are the regulatory trends for mycotoxin binders?"
   → Uses check_regulatory_research_status()

3. "Compare methodologies for digestibility studies in swine"
   → Uses compare_research_methodologies()

4. "Analyze research trends in precision nutrition for dairy cattle"
   → Uses analyze_feed_research_trends()

5. "Create a priority matrix for our alternative protein research"
   → Uses generate_research_priority_matrix()
"""
