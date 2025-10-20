<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>Mapa del Sitio XML</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            background-color: #0a0f1a;
            color: #e5e7eb;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          h1 {
            color: #22d3ee;
            font-size: 2rem;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .subtitle {
            color: #9ca3af;
            margin-bottom: 30px;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
          }
          .stat-card {
            background: #142030;
            border: 1px solid rgba(34, 211, 238, 0.3);
            border-radius: 8px;
            padding: 20px;
          }
          .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #22d3ee;
            margin-bottom: 5px;
          }
          .stat-label {
            color: #9ca3af;
            font-size: 0.875rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #142030;
            border: 1px solid rgba(34, 211, 238, 0.3);
            border-radius: 8px;
            overflow: hidden;
          }
          th {
            background: rgba(34, 211, 238, 0.1);
            color: #22d3ee;
            padding: 15px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 15px;
            border-top: 1px solid rgba(34, 211, 238, 0.1);
          }
          tr:hover {
            background: rgba(34, 211, 238, 0.05);
          }
          a {
            color: #22d3ee;
            text-decoration: none;
            word-break: break-all;
          }
          a:hover {
            color: #67e8f9;
          }
          .priority-high {
            color: #22d3ee;
            font-weight: 600;
          }
          .priority-medium {
            color: #fbbf24;
            font-weight: 600;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📖 Mapa del Sitio XML</h1>
          <p class="subtitle">Este sitemap contiene <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs</p>
          
          <div class="stats">
            <div class="stat-card">
              <div class="stat-number"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
              <div class="stat-label">URLs Totales</div>
            </div>
            <div class="stat-card">
              <div class="stat-number"><xsl:value-of select="count(sitemap:urlset/sitemap:url[sitemap:priority >= 0.8])"/></div>
              <div class="stat-label">Alta Prioridad</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Prioridad</th>
                <th>Frecuencia</th>
                <th>Última Modificación</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="sitemap:priority >= 0.8">
                        <span class="priority-high"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="priority-medium"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                  <td><xsl:value-of select="sitemap:lastmod"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <div class="footer">
            <p>Este mapa del sitio se genera dinámicamente según el contenido disponible.</p>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
