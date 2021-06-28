import ejs from "ejs";

// Define the interface for the content in the template
export interface TemplateContent {
    title: string;
    body: string;
    articleURL: string;
    unsubscribe: string;
}

interface TemplateData extends Omit<TemplateContent, "body"> {
    body: string[];
}

export default async function compileTemplate(
    content: TemplateContent,
    templateFile: string = "emailTemplates/template.ejs"
): Promise<string> {
    // Modify the body
    const newBody = content.body
        .trim()
        .split("\n\n")
        .filter((value) => value !== "");
    const templateData: TemplateData = {
        title: content.title,
        body: newBody,
        articleURL: content.articleURL,
        unsubscribe: content.unsubscribe,
    };

    // Compile the template with the data
    const html = await ejs.renderFile(templateFile, templateData);

    // Return the html
    return html;
}
