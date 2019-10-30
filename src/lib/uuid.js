export default function uuid(prefix='_uuid_') {
  let id;
  do {
    id = `${prefix}${Math.random().toString(36).substr(2)}`;
  } while (document.getElementById(id) != null);

  return id;
}
