# Raspagem de Dados dos Anais da Abrasco

## 📌 Introdução
Este repositório documenta o processo de raspagem de dados realizado para coletar informações dos trabalhos apresentados no **8º Congresso Brasileiro de Ciências Sociais e Humanas em Saúde (CBCSHS) - 2019**. O método empregado envolveu uma combinação de **processos manuais e automatizados**, devido a bloqueios do servidor que impediram uma raspagem totalmente automatizada.

Este processo faz parte do projeto de mestrado do autor e foi utilizado para coletar dados de **outros anais da Abrasco**, respeitando os princípios da ciência aberta e reprodutibilidade da pesquisa.

Os passos detalhados do processo estão documentados dentro do arquivo **`Coleta de dados abrasco.ipynb`**, que contém todas as instruções de raspagem e processamento dos dados.

## 📂 Estrutura dos Arquivos

Os seguintes arquivos compõem o conjunto de dados extraídos e analisados:

- `Coleta de dados abrasco.ipynb` – **Arquivo principal** contendo todos os passos detalhados da raspagem.
- `CBCSHS_2019_completo.xlsx` – Planilha com todos os trabalhos coletados, incluindo eixos temáticos e metadados.
- `eixos_CBCSHS_2019.xlsx` – Lista dos eixos temáticos e suas respectivas categorias.
- `links_trabalhos_CBCSHS_2019.json` – JSON contendo os links dos trabalhos por eixo.
- `links_e_resumos_CBCSHS_2019.json` – JSON com links e resumos extraídos dos trabalhos.
- `trabalhos_sem_resumo_CBCSHS_2019.json` – Lista de trabalhos sem resumo encontrado.
- **Extensões do Chrome**:
  - `Extensão lista itens CBCSHS 2019`
  - `Extensão resumos CBCSHS 2019`

## 🔍 Passo a Passo do Processo

O processo completo está descrito detalhadamente dentro do **notebook Jupyter** (`Coleta de dados abrasco.ipynb`). Abaixo está um resumo das etapas principais:

1. **Coleta dos eixos e links**
   - Os links dos eixos foram extraídos manualmente do menu disponível no site do CBCSHS 2019.
   - Esses links foram armazenados em `eixos_CBCSHS_2019.xlsx`.

2. **Identificação do número de páginas por eixo**
   - Para calcular os links de cada página, foi necessário abrir as páginas dos eixos manualmente e contar os trabalhos por eixo.

3. **Geração dos links das páginas de trabalhos**
   - Com base no número de páginas calculado, foram gerados os links completos de todas as páginas de trabalhos e armazenados em `links_trabalhos_CBCSHS_2019.json`.

4. **Extração de títulos e links dos trabalhos**
   - Foi utilizada a **Extensão do Chrome `lista itens CBCSHS 2019`** para coletar títulos e links dos trabalhos e armazenar no IndexedDB da extensão.
   - Os dados foram exportados manualmente e salvos em `trabalhos_sem_resumo_CBCSHS_2019.json`.

5. **Extração dos resumos**
   - A **Extensão do Chrome `resumos CBCSHS 2019`** foi utilizada para coletar os resumos dos trabalhos.
   - Os resumos extraídos foram salvos manualmente em `links_e_resumos_CBCSHS_2019.json`.

6. **Unificação dos dados e geração do arquivo final**
   - As informações de `trabalhos_sem_resumo_CBCSHS_2019.json` foram combinadas com `links_e_resumos_CBCSHS_2019.json`.
   - O resultado final foi salvo no arquivo `CBCSHS_2019_completo.xlsx`, contendo todas as informações organizadas e padronizadas.

## ⚙️ Tecnologias e Ferramentas Utilizadas

- **Python** (pandas, requests, json, BeautifulSoup)
- **Jupyter Notebook**
- **Extensões do Chrome** (para coleta manual dos links e resumos)
- **Excel/CSV** para organização final dos dados

## 🚧 Restrições do Servidor

Durante a raspagem, verificou-se que o site onde os trabalhos estavam hospedados **bloqueia requisições automatizadas em Python**. Como alternativa, foi necessário recorrer ao **uso de extensões do Chrome** para capturar os dados manualmente, garantindo a completude da base de dados.

## 📖 Como Replicar o Processo

Se deseja replicar a raspagem para outros eventos da Abrasco, siga estas etapas:

1. **Siga os passos descritos no notebook `Coleta de dados abrasco.ipynb`**.
2. **Utilize a extensão do Chrome** para coletar os links dos trabalhos.
3. **Extraia os resumos** com a outra extensão.
4. **Use o notebook Jupyter** para processar e estruturar os dados.
5. **Salve a planilha final** e valide os resultados.

## 🏷️ Informações do Autor

**Gustavo Soibelman**  
Mestrando acadêmico em Saúde Pública - Fiocruz  
📧 gustavo.soibelman@gmail.com  

---

**Observação**: Este repositório documenta especificamente a raspagem do **CBCSHS 2019**, mas o método foi replicado para outros anais da Abrasco. A documentação visa garantir transparência e reprodutibilidade da pesquisa no contexto da **ciência aberta**.
