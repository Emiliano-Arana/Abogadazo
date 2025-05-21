from langchain_ollama import OllamaLLM
from langchain.chains import RetrievalQA
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from typing import Dict, List

class AsistenteLegal:
    def __init__(self):
        """
        Inicializa el asistente legal con:
        - Modelo de embeddings para búsqueda semántica
        - Base de conocimientos vectorial
        - Modelo LLM para generación de respuestas
        - Cadena de QA configurada
        """
        self._inicializar_modelos()
        self._configurar_cadena_qa()

    def _inicializar_modelos(self):
        """Configura los modelos necesarios"""
        try:
            # 1. Modelo de embeddings
            self.embeddings = OllamaEmbeddings(model="mxbai-embed-large")
            
            # 2. Base vectorial con las leyes
            self.vectorstore = FAISS.load_local(
                "legal_embeddings",
                self.embeddings,
                allow_dangerous_deserialization=True
            )
            
            # 3. Modelo de lenguaje (versión corregida de tu modelo)
            self.llm = OllamaLLM(
                model="llama3.2",
                temperature=0.3,
                num_ctx=4096,
                timeout=300 #tiempo de espera
            )
            
        except Exception as e:
            raise RuntimeError(f"Error inicializando modelos: {str(e)}")
        
    def _configurar_cadena_qa(self):
        """Configura la cadena de pregunta-respuesta"""
        # Prompt idéntico al que tenías originalmente
        prompt_template = """Eres un experto en legislación de tránsito. Responde usando solo la información proporcionada.
        Contexto: {context}
        Pregunta: {question}
        Respuesta precisa citando artículos:"""

        prompt = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )
        
        # Crear cadena de QA
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(search_kwargs={"k": 3}),
            chain_type_kwargs={"prompt": prompt},
            return_source_documents=True
        )

    def consultar(self, pregunta: str) -> Dict:
        try:
            resultado = self.qa_chain.invoke({"query": pregunta})
            
            return {
                "respuesta": resultado["result"],
                "fuentes": [
                    {
                        "documento": doc.metadata["source"],
                        "pagina": doc.metadata.get("page", "N/A")
                    }
                    for doc in resultado["source_documents"]
                ]
            }
            
        except Exception as e:
            return {
                "respuesta": f"Error procesando la consulta: {str(e)}",
                "fuentes": []
            }
