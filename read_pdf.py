import sys
try:
    from pypdf import PdfReader
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
    from pypdf import PdfReader

reader = PdfReader(r"C:\Users\Shahzod\Desktop\BMI\Software_Architecture_Roadmap.pdf")
text = ""
for page in reader.pages:
    text += page.extract_text() + "\n"

with open(r"C:\Users\Shahzod\Desktop\BMI\DI\pdf_output.txt", "w", encoding="utf-8") as f:
    f.write(text.strip())

print("PDF extraction completed successfully. Check pdf_output.txt")
