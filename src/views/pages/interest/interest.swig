{% extends '../layout/layout.swig' %}

{% block title %}兴趣设置{% endblock %}

{% block content %}
  <div id="root"></div>
{% endblock %}

{% block script %}
  <script type="text/javascript">
   // 同步依赖，配合packager后所有依赖文件在构建时将会被一并打包
    require('interest/interest.js').init($('#root')[0]);
  </script>

{% endblock %}