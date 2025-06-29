import json
import os
from datetime import datetime
from typing import Any, Dict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pdf_generator import ResumePDFGenerator
from pydantic import BaseModel

app = FastAPI(title="Resume Editor API", version="1.0.0")

# Get CORS origins from environment variable
cors_origins = os.getenv("CORS_ORIGINS").split(",")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class EnhanceRequest(BaseModel):
    section: str
    content: str


class EnhanceResponse(BaseModel):
    section: str
    content: str
    enhanced: bool


class SaveResumeResponse(BaseModel):
    message: str
    timestamp: str


# In-memory storage for saved resumes
saved_resumes = []

# Initialize PDF generator
pdf_generator = ResumePDFGenerator()

# Mock AI enhancement responses
AI_ENHANCEMENTS = {
    "experience": {
        "patterns": [
            "Enhanced leadership capabilities through ",
            "Demonstrated proficiency in ",
            "Successfully implemented ",
            "Achieved measurable results by ",
            "Collaborated effectively with cross-functional teams to ",
        ],
        "improvements": [
            "quantified achievements with specific metrics",
            "highlighted technical skills and frameworks used",
            "emphasized leadership and collaboration aspects",
            "showcased problem-solving abilities",
            "demonstrated impact on business outcomes",
        ],
    },
    "education": {
        "patterns": [
            "Comprehensive coursework in ",
            "Specialized in advanced topics including ",
            "Graduated with distinction, focusing on ",
            "Academic excellence demonstrated through ",
        ],
        "improvements": [
            "relevant coursework details",
            "academic projects and research",
            "honors and achievements",
            "leadership roles in academic settings",
        ],
    },
    "skills": {
        "patterns": [
            "Proficient in ",
            "Advanced expertise in ",
            "Experienced with ",
            "Strong foundation in ",
        ],
        "improvements": [
            "categorized by proficiency level",
            "grouped by technology stack",
            "included emerging technologies",
            "highlighted certifications",
        ],
    },
}


def mock_ai_enhance(section: str, content: str) -> str:
    """
    Mock AI enhancement that improves the content based on section type
    """
    if section not in AI_ENHANCEMENTS:
        return content

    enhanced_content = content
    section_data = AI_ENHANCEMENTS[section]

    if section == "experience":
        # Add more descriptive language and quantify achievements
        enhanced_content = content.replace("Worked on", "Successfully delivered")
        enhanced_content = enhanced_content.replace(
            "Responsible for", "Led initiatives in"
        )
        enhanced_content = enhanced_content.replace("Used", "Leveraged advanced")

        # Add some metrics if not present
        if "%" not in enhanced_content and "increased" in enhanced_content.lower():
            enhanced_content = enhanced_content.replace("increased", "increased by 25%")

    elif section == "education":
        # Enhance education descriptions
        if "Computer Science" in enhanced_content:
            enhanced_content += ". Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems."
        enhanced_content = enhanced_content.replace(
            "graduated", "graduated with academic excellence"
        )

    elif section == "skills":
        # Organize and enhance skills
        skills_list = [skill.strip() for skill in enhanced_content.split(",")]

        # Categorize skills
        frontend_skills = []
        backend_skills = []
        other_skills = []

        for skill in skills_list:
            skill_lower = skill.lower()
            if any(
                term in skill_lower
                for term in ["react", "javascript", "html", "css", "vue", "angular"]
            ):
                frontend_skills.append(skill)
            elif any(
                term in skill_lower
                for term in ["python", "node", "java", "sql", "database"]
            ):
                backend_skills.append(skill)
            else:
                other_skills.append(skill)

        enhanced_skills = []
        if frontend_skills:
            enhanced_skills.extend([f"Frontend: {', '.join(frontend_skills)}"])
        if backend_skills:
            enhanced_skills.extend([f"Backend: {', '.join(backend_skills)}"])
        if other_skills:
            enhanced_skills.extend([f"Other: {', '.join(other_skills)}"])

        if enhanced_skills:
            enhanced_content = " | ".join(enhanced_skills)

    return enhanced_content


@app.get("/")
async def root():
    return {"message": "Resume Editor API is running", "version": "1.0.0"}


@app.post("/ai-enhance", response_model=EnhanceResponse)
async def enhance_section(request: EnhanceRequest):
    """
    Enhance a resume section using mock AI
    """
    try:
        if not request.content.strip():
            raise HTTPException(status_code=400, detail="Content cannot be empty")

        enhanced_content = mock_ai_enhance(request.section, request.content)

        return EnhanceResponse(
            section=request.section, content=enhanced_content, enhanced=True
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")


@app.post("/save-resume", response_model=SaveResumeResponse)
async def save_resume(resume_data: Dict[str, Any]):
    """
    Save resume data to memory and optionally to a local file
    """
    try:
        # Add timestamp to the resume data
        resume_with_timestamp = {
            **resume_data,
            "saved_at": datetime.now().isoformat(),
            "id": len(saved_resumes) + 1,
        }

        # Save to in-memory storage
        saved_resumes.append(resume_with_timestamp)

        # Optionally save to local file (Note: This won't work on Vercel serverless)
        try:
            os.makedirs("saved_resumes", exist_ok=True)
            filename = f"saved_resumes/resume_{resume_with_timestamp['id']}.json"

            with open(filename, "w") as f:
                json.dump(resume_with_timestamp, f, indent=2)

        except Exception as file_error:
            print(f"Warning: Could not save to file: {file_error}")

        return SaveResumeResponse(
            message="Resume saved successfully",
            timestamp=resume_with_timestamp["saved_at"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Save failed: {str(e)}")


@app.post("/download-resume-pdf")
async def download_resume_pdf(resume_data: Dict[str, Any]):
    """
    Generate and download resume as PDF
    """
    try:
        # Debug: Log the received data
        print("Received resume data for PDF generation:")
        print(json.dumps(resume_data, indent=2))

        # Generate PDF
        pdf_buffer = pdf_generator.generate_pdf(resume_data)

        # Get the name for the filename
        personal_info = resume_data.get("personalInfo", {})
        name = personal_info.get("name", "Resume")

        # Clean the name for filename
        safe_name = "".join(
            c for c in name if c.isalnum() or c in (" ", "-", "_")
        ).rstrip()
        safe_name = safe_name.replace(" ", "_")

        filename = f"{safe_name}_Resume.pdf"

        print(f"Generated PDF filename: {filename}")

        # Return PDF as streaming response
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    except Exception as e:
        print(f"PDF generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


@app.get("/saved-resumes")
async def get_saved_resumes():
    """
    Retrieve all saved resumes (for testing purposes)
    """
    return {"resumes": saved_resumes, "count": len(saved_resumes)}


@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
