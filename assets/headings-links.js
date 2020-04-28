// Thanks to
// https://david.darn.es/2017/07/25/adding-heading-links-to-your-jekyll-blog/
const headings = document.querySelectorAll('.page-post h1,.page-post h2,.page-post h3');
const linkContent = '&nbsp;🔗';
for (const heading of headings) {
    const linkIcon = document.createElement('a');
    linkIcon.setAttribute('class', "heading-link");
    linkIcon.setAttribute('href', `#${heading.id}`);
    linkIcon.innerHTML = linkContent;
    heading.appendChild(linkIcon);
}