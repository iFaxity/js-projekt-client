/**
 * Decodes a payload from a JWT token
 * @param {string} token - JWT token
 * @returns {string}
 */
export function parseToken(token) {
  const payload = token.split('.')[1];
  const decoded = atob(payload);
  const str = [...decoded].map(c => {
    return '%' + c.charCodeAt(0).toString(16).padStart(2, '0')
  }).join('');

  return JSON.parse(decodeURIComponent(str));
}

const REQUEST_OPTS = {
  method: 'get',
  data: null,
  headers: {},
};

/**
 * Sends a fetch request
 * @param {string} root - Root url
 * @param {object} options - Options object
 */
export async function request(root, options) {
  const {
    method,
    data,
    headers,
    path,
  } = Object.assign({}, REQUEST_OPTS, options);

  const opts = {
    method: method || 'get',
    headers: headers,
  };
  let url = root + path;

  // Parse the body
  if (data != null && typeof data == 'object') {
    if (opts.method != 'post' && opts.method != 'put') {
      url += '?' + new URLSearchParams(data);
    } else if (typeof data == 'object' || Array.isArray(data)) {
      opts.body = JSON.stringify(data);
      opts.headers['Content-Type'] = 'application/json';
    }
  }

  const res = await fetch(url, opts);
  const body = await res.json();


  if (!res.ok) {
    const ex = new Error(body.message);
    ex.status = res.status;
    throw ex;
  }
  return body;
}

// Authentication middleware
export function middleware(to, from, next) {
  const { meta } = to;

  if (meta && meta.auth && API.token) {
    next({
      name: 'login',
      query: {
        redirect: to.fullPath != '/' ? to.fullPath : undefined,
      }
    });
  } else {
    next();
  }
}
