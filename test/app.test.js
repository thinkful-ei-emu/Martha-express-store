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

    context('incorrect information', () => {
      it('should return 400 with message with incorrect username', () => {
        return supertest(app)
          .post('/register')
          .send({
            'username': 'No',
            'password': 'c00d1ng1sc00l',
            'favoriteClub': 'Cache Valley Stone Society',
            'newsLetter': 'true'
          })
          .expect(400, 'Username number be between 6 and 20 characters long');
      });
      it('should return 400 with message with incorrect password', () => {
        return supertest(app)
          .post('/register')
          .send({
            'username': 'Martha',
            'password': 'NO',
            'favoriteClub': 'Cache Valley Stone Society',
            'newsLetter': 'true'
          })
          .expect(400, 'Password number be between 8 and 36 characters long');
      });
      //not sure how to make this work for the last validation statement
      it('should return 400 if password does not have a number', () => {
        return supertest(app)
          .post('/register')
          .send({
            'username': 'Martha',
            'password': 'NO',
            'favoriteClub': 'Cache Valley Stone Society',
            'newsLetter': 'true'
          })
          .expect(400, 'Password must contain at least one digit');
      });
    });

  });

  context('Delete request', () => {
    // //how do you mock deleting a user

    // it('should delete based on userId', () => {
    //   return supertest(app)
    //     .delete('/user/:userId')
    //     .expect(204);

    // });

    //
    // it('should return 404 if user is not found', ()=> {
    //   return supertest(app)
    //     .delete('user/:userId')
    //     .send({})
    //     .expect(404, 'User not found');
    // });
  });
});