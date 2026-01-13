// ============================================================================
// PLUGIN: CARD DE TEXTO (Versão Modular)
// ============================================================================

(function() {
    // 1. INJEÇÃO DE ESTILO (CSS)
    // O plugin adiciona seu próprio estilo ao cabeçalho da página
    const style = document.createElement('style');
    style.innerHTML = `
        /* Fundo escuro atrás da janela */
        .text-plugin-overlay {
            display: none;
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 9999;
            align-items: center; justify-content: center;
            backdrop-filter: blur(2px);
        }
        
        /* A Janela de Edição */
        .text-plugin-modal {
            background: #1e1e1e;
            width: 500px;
            max-width: 90%;
            border-radius: 12px;
            border: 1px solid #333;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            display: flex; flex-direction: column;
            overflow: hidden;
            animation: popIn 0.2s ease-out;
        }

        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        /* Inputs */
        .text-plugin-header { padding: 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
        .text-plugin-body { padding: 20px; display: flex; flex-direction: column; gap: 15px; }
        
        #tp-title {
            background: transparent; border: none; color: #fff; font-size: 1.5rem; font-weight: bold; width: 100%; outline: none;
        }
        #tp-title::placeholder { color: #555; }

        #tp-content {
            background: #252525; border: 1px solid #333; color: #ccc; 
            padding: 15px; border-radius: 8px; font-family: sans-serif; font-size: 1rem; line-height: 1.5;
            min-height: 200px; resize: vertical; outline: none;
        }
        #tp-content:focus { border-color: #bb86fc; }

        /* Botões */
        .text-plugin-footer { padding: 15px 20px; background: #252525; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #333; }
        .tp-btn { padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; border: none; }
        .tp-btn-save { background: #bb86fc; color: #000; }
        .tp-btn-save:hover { background: #a370db; }
        .tp-btn-cancel { background: transparent; color: #888; border: 1px solid #444; }
        .tp-btn-cancel:hover { background: #333; color: #fff; }
    `;
    document.head.appendChild(style);

    // 2. INJEÇÃO DE HTML (A Interface)
    // O plugin cria sua própria janela no corpo da página
    const modalHTML = `
        <div id="text-plugin-root" class="text-plugin-overlay">
            <div class="text-plugin-modal">
                <div class="text-plugin-header">
                    <input type="text" id="tp-title" placeholder="Título da Nota">
                </div>
                <div class="text-plugin-body">
                    <textarea id="tp-content" placeholder="Digite seu texto aqui..."></textarea>
                </div>
                <div class="text-plugin-footer">
                    <button id="tp-cancel" class="tp-btn tp-btn-cancel">Cancelar</button>
                    <button id="tp-save" class="tp-btn tp-btn-save">Salvar</button>
                </div>
            </div>
        </div>
    `;
    const divContainer = document.createElement('div');
    divContainer.innerHTML = modalHTML;
    document.body.appendChild(divContainer);

    // 3. LÓGICA (Javascript)
    
    // Referências aos elementos criados acima
    const overlay = document.getElementById('text-plugin-root');
    const inputTitle = document.getElementById('tp-title');
    const inputContent = document.getElementById('tp-content');
    const btnSave = document.getElementById('tp-save');
    const btnCancel = document.getElementById('tp-cancel');
    
    let activeCardId = null; // Para saber qual card estamos editando

    // Função para abrir o editor
    function openEditor(cardElement) {
        activeCardId = cardElement.id;
        
        // Pega os dados atuais do card para preencher o editor
        const currentTitle = cardElement.querySelector('h2').innerText;
        const currentText = cardElement.querySelector('p').innerText;
        
        inputTitle.value = currentTitle === 'Nova Nota' ? '' : currentTitle;
        inputContent.value = currentText === 'Clique duas vezes para editar...' ? '' : currentText;
        
        overlay.style.display = 'flex';
        inputTitle.focus();
    }

    // Função para fechar
    function closeEditor() {
        overlay.style.display = 'none';
        activeCardId = null;
    }

    // Função para salvar
    function saveContent() {
        if (activeCardId) {
            const card = document.getElementById(activeCardId);
            if (card) {
                const newTitle = inputTitle.value || 'Nova Nota';
                const newText = inputContent.value || 'Clique duas vezes para editar...';
                
                // Atualiza o visual do card
                card.querySelector('h2').innerText = newTitle;
                card.querySelector('p').innerText = newText;
            }
        }
        closeEditor();
    }

    // Eventos dos botões do modal
    btnSave.onclick = saveContent;
    btnCancel.onclick = closeEditor;
    
    // Fecha ao clicar fora (opcional)
    overlay.onclick = (e) => { if (e.target === overlay) closeEditor(); };

    // 4. REGISTRO NO SISTEMA PRINCIPAL
    // Verifica se o sistema principal existe
    if (window.registerPlugin && window.spawnCardAtCenter) {
        
        // A. Adiciona botão na barra lateral
        window.registerPlugin('📝', 'Adicionar Texto', () => {
            window.spawnCardAtCenter(`
                <div class="card-content">
                    <h2>Nova Nota</h2>
                    <p style="white-space: pre-wrap;">Clique duas vezes para editar...</p>
                </div>
            `, 'text-plugin'); // Define o TIPO como 'text-plugin'
        });

        // B. Define o comportamento do Duplo Clique para este tipo
        window.registerCardBehavior('text-plugin', (cardElement) => {
            openEditor(cardElement);
        });

    } else {
        console.error("ERRO: O sistema principal (Core) não foi encontrado.");
    }

})();
