function isBase64(str) {
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
}

export function base(f){
    let e=''
    if (isBase64(f)) {
        e = atob(f);
    }
    else(
        e=f
    )
    return e
}
