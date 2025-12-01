export type LinkRow = {
  name: string;
  date: string;
  link: string;
  tag: string;
};

export class LocalStorageService {
  private storageKey = "links-academicos";
  private rows: LinkRow[] | null = null; // carregamento lazy

  // garante que os dados sejam carregados do browser
  private ensureLoaded() {
    if (this.rows !== null) return;

    if (typeof window !== "undefined" && window.localStorage) {
      const data = window.localStorage.getItem(this.storageKey);
      this.rows = data ? JSON.parse(data) : [];
    } else {
      this.rows = []; // fallback se não estiver no browser
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.rows));
    }
  }

  // LISTAR
  list(): LinkRow[] {
    this.ensureLoaded();
    return [...(this.rows as LinkRow[])];
  }

  // INSERIR
  insert(row: LinkRow): LinkRow {
    this.ensureLoaded();
    this.rows!.push(row);
    this.saveToStorage();
    return row;
  }

  // DETALHAR
  detail(index: number): LinkRow | null {
    this.ensureLoaded();
    return this.rows![index] ?? null;
  }

  // ATUALIZAR
  update(index: number, newData: Partial<LinkRow>): LinkRow | null {
    this.ensureLoaded();
    if (!this.rows![index]) return null;

    this.rows![index] = { ...this.rows![index], ...newData };
    this.saveToStorage();
    return this.rows![index];
  }

  // REMOVER
  remove(index: number): boolean {
    this.ensureLoaded();
    if (!this.rows![index]) return false;

    this.rows!.splice(index, 1);
    this.saveToStorage();
    return true;
  }
}

export const localStorage = new LocalStorageService();
