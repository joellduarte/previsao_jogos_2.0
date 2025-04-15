import os
import zipfile
import tkinter as tk
from tkinter import ttk
from tkinter import messagebox
from datetime import datetime
import time

class BackupApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Backup Projeto Brasileirão")
        self.root.geometry("500x250")
        
        # Configuração da janela
        self.root.configure(bg='#f0f0f0')
        
        # Frame principal
        main_frame = tk.Frame(root, bg='#f0f0f0')
        main_frame.pack(expand=True, fill='both', padx=20, pady=20)
        
        # Título
        title = tk.Label(
            main_frame,
            text="Backup - Simulador do Brasileirão 2024",
            font=('Arial', 14, 'bold'),
            bg='#f0f0f0'
        )
        title.pack(pady=10)
        
        # Botão de backup
        self.backup_button = tk.Button(
            main_frame,
            text="Iniciar Backup",
            command=self.start_backup,
            font=('Arial', 12),
            bg='#4CAF50',
            fg='white',
            padx=20,
            pady=10
        )
        self.backup_button.pack(pady=10)
        
        # Barra de progresso
        self.progress = ttk.Progressbar(
            main_frame,
            orient="horizontal",
            length=400,
            mode="determinate"
        )
        self.progress.pack(pady=10)
        
        # Status
        self.status_label = tk.Label(
            main_frame,
            text="",
            font=('Arial', 10),
            bg='#f0f0f0',
            wraplength=450
        )
        self.status_label.pack(pady=10)
        
        # Info
        self.info_label = tk.Label(
            main_frame,
            text="",
            font=('Arial', 10),
            bg='#f0f0f0',
            wraplength=450
        )
        self.info_label.pack(pady=5)

    def get_files_to_backup(self, start_path, zip_filename):
        """Retorna lista de arquivos para backup, excluindo apenas o arquivo zip atual"""
        files_to_backup = []
        total_size = 0
        
        for root, dirs, files in os.walk(start_path):
            for file in files:
                file_path = os.path.join(root, file)
                # Pula apenas o arquivo zip que está sendo criado
                if file == zip_filename:
                    continue
                    
                if os.path.isfile(file_path):
                    files_to_backup.append(file_path)
                    total_size += os.path.getsize(file_path)
        
        return files_to_backup, total_size

    def start_backup(self):
        """Inicia o processo de backup"""
        self.backup_button.configure(state='disabled')
        self.progress["value"] = 0
        self.status_label.configure(text="Preparando backup...")
        self.root.update()
        
        try:
            # Define o diretório do projeto e nome do arquivo
            project_dir = os.path.abspath(os.path.dirname(__file__))
            project_name = os.path.basename(project_dir)
            zip_filename = f"backup_{project_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip"
            zip_path = os.path.join(project_dir, zip_filename)
            
            # Lista arquivos e calcula tamanho total
            files_to_backup, total_size = self.get_files_to_backup(project_dir, zip_filename)
            
            if not files_to_backup:
                messagebox.showerror("Erro", "Nenhum arquivo encontrado para backup!")
                return
            
            self.status_label.configure(text=f"Iniciando backup de {len(files_to_backup)} arquivos...")
            processed_size = 0
            start_time = time.time()
            
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for file_path in files_to_backup:
                    # Calcula o caminho relativo para o arquivo no zip
                    arcname = os.path.relpath(file_path, project_dir)
                    
                    # Atualiza progresso
                    file_size = os.path.getsize(file_path)
                    processed_size += file_size
                    progress = (processed_size / total_size) * 100
                    self.progress["value"] = progress
                    
                    # Atualiza status
                    status = f"Comprimindo: {arcname}\n"
                    status += f"Progresso: {progress:.1f}%"
                    self.status_label.configure(text=status)
                    
                    # Atualiza velocidade
                    elapsed_time = max(1, time.time() - start_time)
                    speed = processed_size / (elapsed_time * 1024 * 1024)  # MB/s
                    self.info_label.configure(text=f"Velocidade: {speed:.1f} MB/s")
                    
                    self.root.update()
                    zipf.write(file_path, arcname)
            
            # Mostra resultado
            final_size = os.path.getsize(zip_path)
            ratio = (1 - (final_size / total_size)) * 100
            elapsed_time = time.time() - start_time
            
            success_msg = f"Backup concluído em {elapsed_time:.1f} segundos!\n"
            success_msg += f"Arquivos: {len(files_to_backup)}\n"
            success_msg += f"Tamanho original: {total_size/1024/1024:.1f} MB\n"
            success_msg += f"Tamanho do zip: {final_size/1024/1024:.1f} MB\n"
            success_msg += f"Taxa de compressão: {ratio:.1f}%"
            
            self.status_label.configure(text=success_msg)
            self.info_label.configure(text=f"Arquivo salvo como: {zip_filename}")
            messagebox.showinfo("Sucesso", success_msg)
            
        except Exception as e:
            error_msg = f"Erro durante o backup: {str(e)}"
            self.status_label.configure(text=error_msg)
            messagebox.showerror("Erro", error_msg)
        
        finally:
            self.backup_button.configure(state='normal')

def main():
    root = tk.Tk()
    app = BackupApp(root)
    root.mainloop()

if __name__ == "__main__":
    main() 