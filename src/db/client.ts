import { DB_ORIGIN } from './defines';
export async function getItem<T>(name: string, id = '') {
  const res = await fetch(`${DB_ORIGIN}/${name}` + (id ? `/${id}` : ''));
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`${name}/${id} not found`);
    }
    throw new Error(`Failed to fetch ${name}/${id}: ${res.statusText}`);
  }
  const item = await res.json();
  return item as T;
}

export async function getItems<T>(name: string) {
  const res = await fetch(`${DB_ORIGIN}/${name}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${name}: ${res.statusText}`);
  }
  const items = await res.json();
  return items as T[];
}

export async function createItem<T>(name: string, item: T) {
  const res = await fetch(`${DB_ORIGIN}/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    throw new Error(`Failed to create ${name}: ${res.statusText}`);
  }
  const createdItem = await res.json();
  return createdItem as T;
}

export async function updateItem<T>(
  name: string,
  id: string,
  patch: Partial<T>
) {
  const res = await fetch(`${DB_ORIGIN}/${name}` + (id ? `/${id}` : ''), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    throw new Error(`Failed to update ${name}/${id}: ${res.statusText}`);
  }
  const updatedItem = await res.json();
  return updatedItem as T;
}

export async function deleteItem<T>(name: string, id: string) {
  const res = await fetch(`${DB_ORIGIN}/${name}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete ${name}/${id}: ${res.statusText}`);
  }
  const deletedItem = await res.json();
  return deletedItem as T;
}

export async function deleteItems(name: string, ids: string[]) {
  await Promise.all(
    ids.map((id) =>
      deleteItem(name, id).catch((error) => {
        console.error(error);
        return null;
      })
    )
  );
}

export async function deleteAllItems(name: string) {
  const items: { id: string }[] = await getItems(name);
  await deleteItems(
    name,
    items.map((item) => item.id)
  );
}
