<div bsl-view="shared-file"></div>
<div bsl-view="home-file2"></div>

<div bsl-part="navigation.html"></div>

<div bsl-view="stats/index.html?id={{user.id}}"></div>
<div bsl-view="stats/index.html?id=4564567897"></div>

<div bsl-view="stats/users/index.html"></div>
<div bsl-view="stats/users/sign-ups.html"></div>


<span data-field="first_name"></span>

<span data-object="settings" data-field="whatever"></span>


<!-- EVENTS -->
<div bsl-view="stats/users/index.html" bsl-e-click="openPage"></div>
<div bsl-view="stats/users/index.html" bsl-e-touchstart="openPage"></div>
<div bsl-view="stats/users/index.html" bsl-e="click:openPage;keyup:die"></div>



<!-- Triggers -->
<div bsl-trigger="createAnalyticsTable" bsl-view="naviga"></div>


<!-- Loops (potential new feature) -->
<div bsl-loop="whatever in whatevers">
	<span>{{valueA}}</span>
</div>