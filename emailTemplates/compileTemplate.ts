import ejs from "ejs";

// Define the interface for the content in the template
export interface TemplateContent {
    title: string;
    body: string;
    articleURL: string;
    unsubscribe: string;
}

export default async function compileTemplate(
    content: TemplateContent,
    templateFile: string = "emailTemplates/template.ejs"
): Promise<string> {
    // Compile the template with the data
    const html = await ejs.renderFile(templateFile, content);

    // Return the html
    return html;
}
