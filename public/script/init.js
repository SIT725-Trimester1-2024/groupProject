if (!localStorage.getItem('token')) {
    location.href = '/';
} else {
    //fetch the current page again 
        fetch(location.pathname, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }).then((res) => res.text())
        .then((rawHtml) => {
            document.write(rawHtml);
            document.close;
        });
}