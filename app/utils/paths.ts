/**
 * PATH_UTILITY [MODULE_V1.0]
 * Protocolo: Centralização de caminhos para compatibilidade com GitHub Pages (basePath)
 */

const BASE_PATH = "/meu-portfolio";
const isProd = process.env.NODE_ENV === 'production';

/**
 * Adiciona o prefixo de basePath em caminhos internos quando em produção.
 */
export function withPrefix(path: string): string {
   // Em desenvolvimento, não usamos basePath
   if (!isProd) return path;

   // Se já começar com o BASE_PATH, não duplica
   if (path.startsWith(BASE_PATH)) return path;
   
   // Garante que o caminho comece com /
   const normalizedPath = path.startsWith('/') ? path : `/${path}`;
   
   return `${BASE_PATH}${normalizedPath}`;
}
