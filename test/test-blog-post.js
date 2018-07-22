const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);


describe('BlogPost', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list blog-posts on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');

        expect(res.body.length).to.be.above(0);
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.have.all.keys('id', 'title', 'content','author','publishedDate');
        });
      });
  });

  // // id: uuid.v4(),
  // title: title,
  // content: content,
  // author: author,
  // publishDate: publishDate || Date.now()
  it('should add a blog-post on POST',
    function() {
      const newBlogPost = {
        title: 'New blog-post', content: 'New blog post content', author:'John Doe'};

      const expectedKeys = ["id", "publishDate"].concat(Object.keys(newPost));

      return chai
        .request(app)
        .post("/blog-posts")
        .send(newPost)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.all.keys(expectedKeys);
          expect(res.body.title).to.equal(newPost.title);
          expect(res.body.content).to.equal(newPost.content);
          expect(res.body.author).to.equal(newPost.author);
        });
    });

  it("should update blog posts on PUT", function() {
    return (
      chai
        .request(app)
        // first have to get
        .get("/blog-posts")
        .then(function(res) {
          const updatedPost = Object.assign(res.body[0], {
            title: "connect the dots",
            content: "la la la la la"
          });
          return chai
            .request(app)
            .put(`/blog-posts/${res.body[0].id}`)
            .send(updatedPost)
            .then(function(res) {
              expect(res).to.have.status(204);
            });
        })
    );
  });

  it("should delete posts on DELETE", function() {
    return (
      chai
        .request(app)
        // first have to get
        .get("/blog-posts")
        .then(function(res) {
          return chai
            .request(app)
            .delete(`/blog-posts/${res.body[0].id}`)
            .then(function(res) {
              expect(res).to.have.status(204);
            });
        })
    );
  });
});