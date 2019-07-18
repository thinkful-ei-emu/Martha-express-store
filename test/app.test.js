const app = require('../src/app');

describe('App', ()=> {
  context('Starting SetUp', () => {
    it('GET / responds with 200 containing "Hello World', () => {
      return supertest(app)
        .get('/')
        .expect(200, 'A GET Request');
    });
  
    it('Post / responds with a 200 containing "POST request received', () => {
      return supertest(app)
        .post('/')
        .expect(200, 'POST request received');
    });
  });

  context('Post with Validation',() => {
    it.skip('Happy Case: should post a new user', () => {
      return supertest(app)
        .post('/register')
        .send({
          'username': 'Martha',
          'password': 'c00d1ng1sc00l7',
          'favoriteClub': 'Cache Valley Stone Society',
          'newsLetter': 'true'
        })
        .expect(201)
        .expect(res => {
          expect(res.body).to.include.all.keys('id', 'username', 'password', 'favoriteClub', 'newsLetter');
        });
    });
    
    context('missing information', () => {
      it('should send a error if no username provided', () => {
        return supertest(app)
          .post('/register')
          .send({'username': ''})
          .expect(400, 'Username required');
      });
      it('should send a error if no password provided', () => {
        return supertest(app)
          .post('/register')
          .send({'password': ''})
          .expect(400, 'Username required');
      });
      it('should send a error if no FavoriteClub provided', () => {
        return supertest(app)
          .post('/register')
          .send({'favoriteClub': ''})
          .expect(400, 'Username required');
      });
    });

    
  });

  context('Delete request', () => {
    it('should delete based on userId');
  });

  context('errorHanlder', () => {
  });
});