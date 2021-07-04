<script>
  import Test, { META as attributes } from "assets/data/test.md";
  import imgfile from "assets/img/import.jpg";
</script>

<div class="container py-5">
  <h1 class="text-center text-muted font-weight-100">
    Hello, World!
  </h1>

  <p class="text-center">
    Olá! Esta é uma aplicação Svelte inspirada no boilerplate padrão e, também, no <code>create-react-app</code>, mas feita apenas com Webpack!
  </p>

  <p class="text-center">
    Você pode usar conteúdo de <code>public</code> normalmente, como se fosse a raíz:<br/>
    <img src="/img/hello.jpg" alt=""/>
  </p>

  <p class="text-center">
    Ou importar via código, para que seja hasheada:<br/>
    <img src={imgfile} alt=""/>
  </p>

  <p class="text-center">
    Como bônus, adicionei Bootstrap e, também, FontAwesome! <i class="fa fa-truck"/>
  </p>

  <p class="text-center">
    Também tem hot reload, resolução de caminhos pra JS/SCSS (<em>exceto SCSS declarado no componente, mas só por enquanto</em>), imports de arquivos com resolução e outras mágicas.
  </p>

  <p class="text-center">
    Este projeto foi feito com o intuito de ensinar as pessoas a usarem Webpack, e explicar como bundlers e templates de projeto funcionam. Fazendo parte de um projeto no qual monto o MESMO boilerplate para três frameworks diferentes, mas seguindo o mesmo conceito e lógicas.
  </p>

  <hr/>

  <h4>Quer mais? Então aqui:</h4>

  <p>A gente também suporta Markdown com frontmatter!</p>

  <h5>Aqui um markdownzinho:</h5>

  <div class="shadow p-2 mb-2">
    <Test/>
  </div>

  <h5>E o frontmatter dele:</h5>

  <div class="shadow p-2">
    <pre>{JSON.stringify(attributes, null, 2)}</pre>
  </div>

  <hr/>

  <p class="text-muted">
    <em>
      &copy;2021 Fabio Y. Goto
    </em>
  </p>
</div>
