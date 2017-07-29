<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="format-detection" content="telephone=no">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <meta name="wap-font-scale" content="no">
    <link rel="shortcut icon" href="xxx">
    <title>{% block title %}{% endblock %}</title>
    <script type="text/javascript">
        var t0 = Date.now();
        window._timePoints = [t0];
    </script><!--ignore-->
    <link rel="stylesheet" href="../layout/layout.scss">
    {% block style %}{% endblock %}
  </head>
  <body>
    {% block content %}{% endblock %}
    <script type="text/javascript">window._timePoints[1] = Date.now();</script><!--ignore-->
    <script src="../../lib/mod/mod.js"></script>
    <script src="../../lib/zepto/zepto.js"></script>
    <script src="../../lib/vue/vue.js"></script>
    {% block script %}{% endblock %}
  </body>
</html>