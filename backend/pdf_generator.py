import json
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


class ResumePDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()

    def setup_custom_styles(self):
        # Custom styles for the resume
        self.styles.add(
            ParagraphStyle(
                name="CustomTitle",
                parent=self.styles["Heading1"],
                fontSize=24,
                spaceAfter=12,
                alignment=TA_CENTER,
                textColor=colors.HexColor("#2563eb"),
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="ContactInfo",
                parent=self.styles["Normal"],
                fontSize=11,
                alignment=TA_CENTER,
                spaceAfter=20,
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="SectionHeader",
                parent=self.styles["Heading2"],
                fontSize=16,
                spaceBefore=20,
                spaceAfter=10,
                textColor=colors.HexColor("#2563eb"),
                borderWidth=1,
                borderColor=colors.HexColor("#2563eb"),
                borderPadding=5,
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="JobTitle",
                parent=self.styles["Normal"],
                fontSize=12,
                spaceBefore=10,
                spaceAfter=2,
                textColor=colors.HexColor("#1f2937"),
                fontName="Helvetica-Bold",
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="Company",
                parent=self.styles["Normal"],
                fontSize=11,
                spaceAfter=2,
                textColor=colors.HexColor("#2563eb"),
                fontName="Helvetica-Bold",
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="DateRange",
                parent=self.styles["Normal"],
                fontSize=10,
                spaceAfter=5,
                textColor=colors.HexColor("#6b7280"),
                fontName="Helvetica-Oblique",
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="Description",
                parent=self.styles["Normal"],
                fontSize=10,
                spaceAfter=10,
                alignment=TA_JUSTIFY,
                leftIndent=20,
            )
        )

    def generate_pdf(self, resume_data):
        """Generate PDF from resume data"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18,
        )

        story = []

        # Personal Information Section
        personal_info = resume_data.get("personalInfo", {})
        if personal_info:
            story.extend(self._add_personal_info(personal_info))

        # Experience Section
        experience = resume_data.get("experience", [])
        if experience:
            story.extend(self._add_experience_section(experience))

        # Education Section
        education = resume_data.get("education", [])
        if education:
            story.extend(self._add_education_section(education))

        # Skills Section
        skills = resume_data.get("skills", [])
        if skills:
            story.extend(self._add_skills_section(skills))

        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer

    def _add_personal_info(self, personal_info):
        """Add personal information section"""
        story = []

        # Name
        name = personal_info.get("name", "Your Name")
        story.append(Paragraph(name, self.styles["CustomTitle"]))

        # Contact Information
        contact_parts = []
        if personal_info.get("email"):
            contact_parts.append(personal_info["email"])
        if personal_info.get("phone"):
            contact_parts.append(personal_info["phone"])
        if personal_info.get("location"):
            contact_parts.append(personal_info["location"])

        if contact_parts:
            contact_text = " | ".join(contact_parts)
            story.append(Paragraph(contact_text, self.styles["ContactInfo"]))

        return story

    def _add_experience_section(self, experience):
        """Add work experience section"""
        story = []
        story.append(Paragraph("WORK EXPERIENCE", self.styles["SectionHeader"]))

        for exp in experience:
            # Job title
            position = exp.get("position", "Position")
            story.append(Paragraph(position, self.styles["JobTitle"]))

            # Company
            company = exp.get("company", "Company")
            story.append(Paragraph(company, self.styles["Company"]))

            # Date range
            start_date = exp.get("startDate", "")
            end_date = exp.get("endDate", "")
            if start_date or end_date:
                date_range = f"{start_date} - {end_date}"
                story.append(Paragraph(date_range, self.styles["DateRange"]))

            # Description
            description = exp.get("description", "")
            if description:
                story.append(Paragraph(description, self.styles["Description"]))

            story.append(Spacer(1, 10))

        return story

    def _add_education_section(self, education):
        """Add education section"""
        story = []
        story.append(Paragraph("EDUCATION", self.styles["SectionHeader"]))

        for edu in education:
            # Degree and field
            degree = edu.get("degree", "")
            field = edu.get("field", "")
            if degree and field:
                degree_text = f"{degree} in {field}"
            elif degree:
                degree_text = degree
            elif field:
                degree_text = field
            else:
                degree_text = "Degree"

            story.append(Paragraph(degree_text, self.styles["JobTitle"]))

            # School
            school = edu.get("school", "School")
            story.append(Paragraph(school, self.styles["Company"]))

            # Graduation date and GPA
            grad_date = edu.get("graduationDate", "")
            gpa = edu.get("gpa", "")

            date_gpa_parts = []
            if grad_date:
                date_gpa_parts.append(f"Graduated: {grad_date}")
            if gpa:
                date_gpa_parts.append(f"GPA: {gpa}")

            if date_gpa_parts:
                date_gpa_text = " | ".join(date_gpa_parts)
                story.append(Paragraph(date_gpa_text, self.styles["DateRange"]))

            story.append(Spacer(1, 10))

        return story

    def _add_skills_section(self, skills):
        """Add skills section"""
        story = []
        story.append(Paragraph("SKILLS", self.styles["SectionHeader"]))

        if skills:
            # Group skills into rows for better formatting
            skills_text = " • ".join(skills)
            story.append(Paragraph(skills_text, self.styles["Description"]))

        return story
