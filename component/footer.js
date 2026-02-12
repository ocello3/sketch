const footerTemplate = () => {
	return `
	<ul class="uk-breadcrumb">
		<li><span>&copy; 2022 ocello3</span></li>
		<a href="https://mobile.twitter.com/ocello3" target="_blank" rel="noopener noreferer" class="uk-icon-link" uk-icon="twitter"></a>
		<a href="https://github.com/ocello3/sketch" target="_blank" rel="noopener noreferer" class="uk-icon-link" uk-icon="github"></a>
	</ul>
	`;
}

export const renderFooter = (id) => {
	const text = footerTemplate();
	document.getElementById(id).innerHTML = text;
}
