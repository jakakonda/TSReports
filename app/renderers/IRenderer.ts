export interface IRenderer {
    render(template: string, data: object): Promise<string>;
}