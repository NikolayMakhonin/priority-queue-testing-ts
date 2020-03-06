<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" 
	xmlns:js="urn:custom-javascript" 
    exclude-result-prefixes="msxsl js">
  <xsl:output method="html" encoding="utf-8" />
  <msxsl:script implements-prefix="js" language="JavaScript">
	<![CDATA[
		function FormatDateTime(xsdDateTime, format)
		{	
			//js:FormatDateTime(string(date))
			return xsdDateTime.replace("T", "\xA0"); 
		}
	]]>
  </msxsl:script>
  <xsl:template match="/">
	<!--<xsl:param name="filter" select="[exceptionType!='Notice']"/>
	<xsl:param name="pagenumber" select="0" />-->
	
    <html>
      <head>
        <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
        <style type="text/css">
          .Process{color:#000000}
          .Action{color:#0000FF}
          .UserAction{color:#0000FF}
          .UserError{color:#FF4040}
          .UserWarning{color:#BF0000}
          .Error{color:#FF0000}
          .Fatal{color:#FF0000}
          .Info{color:#7F7F7F}
          .None{color:#000000}
          .Warning{color:#BF0000}
          .Contract{color:#BF0000}
          p, pre{margin-bottom: 0; margin-top: 0}
          .exception{color:#FF0000; font-size: 8pt}
          .stacktrace{color:#7F7F7F; font-size: 8pt}
          A:link {text-decoration: none}
		  
          A:hover {text-decoration: none}
          .logMessage { height: auto; overflow: hidden; margin-top: -17px; }
          .logMessage.collapse { height: 17px; }
		  .logMessage.collapse > pre:not(:first-child) { display: none; }
		  
          .logMessageHeader { height: 17px; width: 10000px; background-color: #f0f0ff; border-top-style: solid; border-top-width: 1px; border-top-color: #7f7f7f; }
          .logMessageContainer { width: 10000px; position: relative; }
		  .symbol { color: white; background-color: black; }
		  .clear-log { margin-left: 20px; display: inline-block; }
		  .update { margin-left: 10px;  }
        </style>
        <script type="text/javascript">
          function logMessageExpandCollapse(elem)
          {
			elem.classList.toggle('collapse');
          }

          var WshShell = null;
          try
          {
            WshShell = new ActiveXObject("WScript.Shell");
          }
          catch (e)
          {
            WshShell = null;
          }
          
          function Run(file)
          {
            try
            {
              file = file.replace(/file:\/\/\//, "");
              file = file.replace(/file:\/\/localhost\//, "");
              file = decodeURIComponent(file);
              file = file.replace(/\//, "\\");
              WshShell.Exec("cmd /C \"" + file + "\"");
              return true;
            }
            catch (e)
            {
              return false;
            }
          }
          
          function OnAnchorClick() 
          {
            Run(this.href);
          }
          
          function InitAnchors() 
          {
            var anchors = document.getElementsByTagName("a")
            if (!anchors) return;
            for (var key in anchors) {
                var anchor = anchors [key];
                if (WshShell)
                {
                  anchor.target = "_blank";
                  anchor.onclick = OnAnchorClick;
                }
                else
                {
                  anchor.target = "_self";
                }
            }          
          }

          document.onload = function () 
          {
             InitAnchors();
          }
          
          document.onreadystatechange = function () 
          {
            if (document.readyState == "complete") InitAnchors();
          }
          
          document.onerror = function () 
          {
            InitAnchors();
          }
          
          document.onabort = function () 
          {
            InitAnchors();
          }
		  
		function changeParam(param, value) {
			try {
				var s = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
				var x = document.XMLDocument;
				if (x == null) {
					x = navigator.XMLDocument;
					s.loadXML(navigator.XSLDocument.xml);
				} else {
					s.loadXML(document.XSLDocument.xml);
				}
				var tem = new ActiveXObject("MSXML2.XSLTemplate");
				tem.stylesheet = s;
				var proc = tem.createProcessor();
				proc.addParameter(param, value);
				proc.input = x;
				proc.transform();
				var str = proc.output;
				var newDoc = document.open("text/html", "replace");
				newDoc.write(str);
				navigator.XMLDocument = x;
				navigator.XSLDocument = s;
				newDoc.close();
			} catch(exception) {
				console.log(exception);
			}
		}
        </script>
      </head>
      <div style="width: 100%; font-family: 'Courier New'; font-size: 10pt;">
        <xsl:for-each select="/root/LogUrls/LogUrl">
          <xsl:element name="u">
            <xsl:element name="a">
              <xsl:attribute name="href">
				  <xsl:value-of select="."/>
              </xsl:attribute>
              <xsl:value-of select="position() - 1"/>
            </xsl:element>
          </xsl:element>
          <xsl:text> | </xsl:text>
        </xsl:for-each>
		<a href="javascript:window.location.href=window.location.href" class="update">Update</a>
		<form action="." method="POST" class="clear-log" onsubmit="javascript: return confirm('Do you want to clear this log?');"><input type="hidden" name="clear_log" value="1"/><input type="submit" value="Clear Log"/></form>
		
		<!--<xsl:variable name="total" select="count(*[name() = $element])"/>
		<a href="javascript:changeParam('pagenumber', {$pagenumber - 1});">Prev</a>
		<a href="javascript:changeParam('pagenumber', {$pagenumber + 1});">Next</a>-->
		
      </div>
      <hr/>
      <span style="font-family: 'Courier New'; font-size: 10pt;">
        <xsl:for-each select="/root/event[exceptionType!='Notice']">
          <xsl:sort order="descending" select="/root/EventInfos/EventInfo[@guid = current()/guid]/LastTime"/>
		  <xsl:variable name="guid" select="guid" />
		  <xsl:variable name="LastTime" select="/root/EventInfos/EventInfo[@guid=$guid]/LastTime"/>
		  <xsl:variable name="Count" select="/root/EventInfos/EventInfo[@guid=$guid]/Count"/>
          <div class="logMessageContainer">
            <div class="logMessageHeader" onclick="logMessageExpandCollapse(this.nextElementSibling); event.preventDefault(); return false;">&#160;</div>
            <div class="logMessage collapse">
              <!-- DateTime to str: http://www.w3.org/TR/xslt20/#date-time-examples -->
              <pre class="{rectype} firstRow" onclick="logMessageExpandCollapse(this.parentElement); event.preventDefault(); return false;"><b><span>[<xsl:value-of select="string($LastTime)"/>][<xsl:value-of select="string($Count)"/>][<xsl:value-of select="rectype"/>][<xsl:value-of select="exceptionType" disable-output-escaping="yes"/>][<xsl:value-of select="methodName" disable-output-escaping="yes"/>][<xsl:value-of select="ip"/>]:</span></b><b><xsl:value-of select="message" disable-output-escaping="yes"/></b></pre>
              <br/>
              <xsl:if test="string-length(assemblyName)&#62;2">
                  <xsl:if test="string-length(assemblyVersion)&#62;2">
                      <pre class="exception">[Assembly: <xsl:value-of select="assemblyName"/>.<xsl:value-of select="assemblyVersion"/>]</pre>
                  </xsl:if>
              </xsl:if>
              <xsl:if test="string-length(ip)&#62;2">
                <pre class="exception">IP = <xsl:value-of select="ip" disable-output-escaping="yes"/></pre>
              </xsl:if>
              <xsl:if test="string-length(machineName)&#62;2">
                <pre class="exception">MachineName = <xsl:value-of select="machineName" disable-output-escaping="yes"/></pre>
              </xsl:if>
              <xsl:if test="string-length(url)&#62;2">
                <pre class="exception">Url = <xsl:value-of select="url" disable-output-escaping="yes"/></pre>
              </xsl:if>
              <xsl:if test="string-length(urlReferrer)&#62;2">
                <pre class="exception">UrlReferrer = <xsl:value-of select="urlReferrer" disable-output-escaping="yes"/></pre>
              </xsl:if>
              <xsl:if test="string-length(get)&#62;2">
                <pre class="exception">Get = <xsl:value-of select="get" disable-output-escaping="yes"/></pre>
              </xsl:if>
              <xsl:if test="string-length(post)&#62;2">
                <pre class="exception">Post = <xsl:value-of select="post" disable-output-escaping="yes"/></pre>
              </xsl:if>
              <xsl:if test="string-length(exception)&#62;5">
                <pre class="exception"><xsl:value-of select="exception" disable-output-escaping="yes"/></pre>
              </xsl:if>
              <xsl:if test="string-length(logstacktrace)&#62;5">
                <pre class="stacktrace">LogStackTrace:<xsl:value-of select="logstacktrace" disable-output-escaping="yes"/></pre>
              </xsl:if>
              <xsl:if test="string-length(threadstacktrace)&#62;5">
                <pre class="stacktrace">ThreadStackTrace:<xsl:value-of select="threadstacktrace" disable-output-escaping="yes"/></pre>
              </xsl:if>
              <xsl:if test="string-length(customstacktrace)&#62;5">
                <pre class="stacktrace">CustomStackTrace:<xsl:value-of select="customstacktrace" disable-output-escaping="yes"/></pre>
              </xsl:if>
              <br/>
            </div>
          </div>
        </xsl:for-each>
      </span>
      <hr/>
      <div style="width: 100%; font-family: 'Courier New'; font-size: 10pt;">
        <xsl:for-each select="/root/LogUrls/LogUrl">
          <xsl:element name="u">
            <xsl:element name="a">
              <xsl:attribute name="href">
                  <xsl:value-of select="."/>
              </xsl:attribute>
              <xsl:value-of select="position() - 1"/>
            </xsl:element>
          </xsl:element>
          <xsl:text> | </xsl:text>
        </xsl:for-each>
      </div>
    </html>
  </xsl:template>
</xsl:stylesheet>
